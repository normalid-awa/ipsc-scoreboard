import { ReactNode } from "react";
import {
	OscillatorTypeMap,
	Timer,
	TimerSetting,
	TimerSettingProps,
} from "../TimerProvider";

const SERVICE_UUID = "812c3d3c-7af6-45e9-a873-edce7a58096a";

/**
 * For retrieving and change the setting of the stopplate
 */
const CONFIGURATION_CHARACTERISTIC_UUID =
	"3c17438d-7eec-4e6f-b5bf-58556d4dee76";
/**
 * For sending hit data and notification
 */
const HIT_NOTIFICATION_CHARACTERISTIC_UUID =
	"6cf04407-568c-4555-8153-3e21bcb85059";
/**
 * For processing cristian time syncronization algorithm
 */
const TIME_SYNC_CHARACTERISTIC_UUID = "c29094c8-63f1-4305-8e5f-9b106e6720b8";
/**
 * For indicator (client send notification to stopplate and the led will flash)
 */
const INDICATOR_CHARACTERISTIC_UUID = "7a7da618-756e-4717-a3f5-364eb48ea9b1";

interface StopplateSettingDTO {
	sensorTriggerThreshold: number;
	debounceTime: number;
	indicatorSleepTime: number;
	randomizeTimerCountdownTime: boolean;
	timerConstantCountdownTime: number;
	timerCountdownTimeRandomMax: number;
	timerCountdownTimeRandomMin: number;
	buzzerFrequency: number;
	buzzerTime: number;
	buzzerWaveformEnum: number;
}

interface DragonCustomsWirelessStopplateSetting extends TimerSetting {
	indicatorDuration: number;
	debounceTime: number;
	sensorTriggerThreshold: number;
}

async function exponentialBackoff<T>(
	max: number,
	delay: number,
	toTry: () => Promise<T>,
	success: (result: T) => void,
	fail: () => void,
) {
	try {
		const result = await toTry();
		success(result);
	} catch (e) {
		console.error(e);
		if (max === 0) {
			return fail();
		}
		setTimeout(function () {
			exponentialBackoff(--max, delay * 2, toTry, success, fail);
		}, delay * 1000);
	}
}

export class DragonCustomWirelessStopplate extends Timer<DragonCustomsWirelessStopplateSetting> {
	private isConnected = false;
	private device?: BluetoothDevice;
	private gattServer?: BluetoothRemoteGATTServer;
	private configurationCharacteristic?: BluetoothRemoteGATTCharacteristic;
	private hitNotificationCharacteristic?: BluetoothRemoteGATTCharacteristic;
	private timeSyncCharacteristic?: BluetoothRemoteGATTCharacteristic;
	private indicatorCharacteristic?: BluetoothRemoteGATTCharacteristic;

	async connect() {
		if (!(await navigator.bluetooth.getAvailability())) {
			alert("Your browser does not support Web Bluetooth.");
			alert(
				"If you're using Apple's device (iOS, iPadOS) please install `Bluefy` browser, as WkWebView (Apple's browser engine) does not support Web Bluetooth.",
			);
			this.dispatchDisconnectEvent();
			return;
		}

		try {
			this.device = await navigator.bluetooth.requestDevice({
				filters: [{ services: [SERVICE_UUID] }],
			});
			this.device.addEventListener(
				"gattserverdisconnected",
				this.reconnect,
			);
			await this.tryToConnect();
		} catch {
			this.dispatchDisconnectEvent();
		}
	}

	private async tryToConnect() {
		exponentialBackoff(
			3 /* max retries */,
			2 /* seconds delay */,
			async () => {
				return await this.device?.gatt?.connect();
			},
			async (gatt) => {
				this.gattServer = gatt;
				await this.setupDevice();
			},
			async () => {
				await this.disconnect();
				this.dispatchDisconnectEvent();
			},
		);
	}

	private reconnect = async (): Promise<void> => {
		if (this.isConnected) await this.tryToConnect();
		// this.dispatchConnectEvent();
	};

	private async setupDevice(): Promise<void> {
		const services = await this.gattServer?.getPrimaryService(SERVICE_UUID);
		if (!services) {
			alert("Failed to get services.");
			return;
		}
		this.configurationCharacteristic = await services.getCharacteristic(
			CONFIGURATION_CHARACTERISTIC_UUID,
		);
		this.hitNotificationCharacteristic = await services.getCharacteristic(
			HIT_NOTIFICATION_CHARACTERISTIC_UUID,
		);
		this.timeSyncCharacteristic = await services.getCharacteristic(
			TIME_SYNC_CHARACTERISTIC_UUID,
		);
		this.indicatorCharacteristic = await services.getCharacteristic(
			INDICATOR_CHARACTERISTIC_UUID,
		);
		this.hitNotificationCharacteristic?.removeEventListener(
			"characteristicvaluechanged",
			this.onHit,
		);
		this.hitNotificationCharacteristic?.addEventListener(
			"characteristicvaluechanged",
			this.onHit,
		);
		this.isConnected = true;
		this.dispatchConnectEvent();
	}

	async disconnect() {
		this.isConnected = false;
		this.gattServer?.disconnect();
		this.dispatchDisconnectEvent();
	}

	private onHit = () => {
		const value =
			(this.hitNotificationCharacteristic?.value?.getUint32(0, true) ??
				0) / 1000;

		this.dispatchHitEvent(value);
	};

	ident(): void {
		this.indicatorCharacteristic?.writeValueWithoutResponse(
			new Uint8Array([1]),
		);
	}

	async start() {
		await this.hitNotificationCharacteristic?.startNotifications();
		await this.timeSyncCharacteristic?.writeValueWithResponse(
			new TextEncoder().encode((0).toString()),
		);
	}

	review(): void {
		this.hitNotificationCharacteristic?.stopNotifications();
	}

	async getSetting(): Promise<DragonCustomsWirelessStopplateSetting> {
		const value = await this.configurationCharacteristic?.readValue();
		const data = JSON.parse(
			new TextDecoder().decode(value),
		) as StopplateSettingDTO;
		return {
			buzzerDuration: data.buzzerTime / 1000,
			buzzerFrequency: data.buzzerFrequency,
			buzzerWaveform: OscillatorTypeMap[data.buzzerWaveformEnum],
			countdownTime: data.timerConstantCountdownTime / 1000,
			randomizeCountdownTime: data.randomizeTimerCountdownTime,
			randomCountdownTimeMax: data.timerCountdownTimeRandomMax / 1000,
			randomCountdownTimeMin: data.timerCountdownTimeRandomMin / 1000,
			debounceTime: data.debounceTime,
			sensorTriggerThreshold: data.sensorTriggerThreshold,
			indicatorDuration: data.indicatorSleepTime,
		};
	}

	async setSetting(setting: DragonCustomsWirelessStopplateSetting) {
		const value: StopplateSettingDTO = {
			sensorTriggerThreshold: setting.sensorTriggerThreshold,
			debounceTime: setting.debounceTime,
			indicatorSleepTime: setting.indicatorDuration,
			randomizeTimerCountdownTime: setting.randomizeCountdownTime,
			timerConstantCountdownTime: setting.countdownTime * 1000,
			timerCountdownTimeRandomMax: setting.randomCountdownTimeMax * 1000,
			timerCountdownTimeRandomMin: setting.randomCountdownTimeMin * 1000,
			buzzerFrequency: setting.buzzerFrequency,
			buzzerTime: setting.buzzerDuration * 1000,
			buzzerWaveformEnum: OscillatorTypeMap.indexOf(
				setting.buzzerWaveform,
			),
		};
		this.configurationCharacteristic?.writeValue(
			new TextEncoder().encode(JSON.stringify(value)),
		);
	}

	renderSettingWidget(
		props: TimerSettingProps<DragonCustomsWirelessStopplateSetting>,
	): ReactNode {
		return (
			<>
				<h1>qweeqw{JSON.stringify(props)}</h1>
			</>
		);
	}
}
