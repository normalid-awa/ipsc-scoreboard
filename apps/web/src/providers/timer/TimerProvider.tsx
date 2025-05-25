"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface TimerSetting {
	/**
	 * whether to randomize the countdown time or not
	 */
	randomizeCountdownTime: boolean;
	/**
	 * time in milliseconds for the countdown timer, if randomizeCountdownTime is true, this value will be ignored
	 */
	countdownTime: number;
	/**
	 *  minimum time in milliseconds for the countdown timer
	 */
	randomCountdownTimeMin: number;
	/**
	 * maximum time in milliseconds for the countdown timer
	 */
	randomCountdownTimeMax: number;
	/**
	 * buzzer frequency in Hz
	 */
	buzzerFrequency: number;
	/**
	 * how long will the buzzer beep in milliseconds
	 */
	buzzerDuration: number;
	/**
	 * the type of waveform for the buzzer
	 */
	buzzerWaveform: OscillatorType;
}

export interface TimerSettingProps<T extends TimerSetting> {
	settingData: T;
	setSettingData: (data: Partial<T>) => void;
}

export type HitCallback = (time: number) => void;

enum TimerEvent {
	Disconnect = "TimerDisconnect",
	Connect = "TimerConnect",
	Hit = "TimerHit",
}

export abstract class Timer<T extends TimerSetting> {
	abstract connect(): Promise<void>;
	abstract disconnect(): Promise<void>;
	abstract ident(): void;
	abstract start(): Promise<void>;
	abstract review(): void;

	protected dispatchConnectEvent() {
		window.dispatchEvent(new CustomEvent(TimerEvent.Connect));
	}
	protected dispatchDisconnectEvent() {
		window.dispatchEvent(new CustomEvent(TimerEvent.Disconnect));
	}
	protected dispatchHitEvent(time: number) {
		window.dispatchEvent(
			new CustomEvent(TimerEvent.Hit, { detail: { time } }),
		);
	}

	abstract getSetting(): Promise<T>;
	abstract setSetting(setting: T): Promise<void>;

	abstract renderSettingWidget(props: TimerSettingProps<T>): ReactNode;
}

interface TimerMap {
	[k: string]: () => Promise<new () => Timer<TimerSetting>>;
}

export const timerMap: TimerMap = {
	"DragonCustom wireless stopplate": async () =>
		(await import("./variants/DragonCustomWirelessStopplate"))
			.DragonCustomWirelessStopplate,
} as const;

export interface TimerContextType {
	isConnected: boolean;
	timer: Timer<TimerSetting>;
	setTimer: (timer: Timer<TimerSetting>) => void;
}

export const TimerContext = createContext<TimerContextType>(null!);

export function useTimer() {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error("useTimer must be used within a TimerProvider");
	}
	return context;
}

export function TimerProvider({ children }: { children: ReactNode }) {
	const [isConnected, setIsConnected] = useState(false);
	const [timer, setTimer] = useState<Timer<TimerSetting>>(null!);

	useEffect(() => {
		addEventListener(TimerEvent.Connect, () => setIsConnected(true));
		addEventListener(TimerEvent.Disconnect, () => setIsConnected(false));
	}, []);

	return (
		<TimerContext.Provider value={{ isConnected, timer, setTimer }}>
			{children}
		</TimerContext.Provider>
	);
}
