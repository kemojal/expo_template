import { NativeModules, Platform, TurboModuleRegistry } from "react-native";

type HapticPreset = () => void;
type PulsarPresets = typeof import("react-native-pulsar").Presets;

let presetsPromise: Promise<PulsarPresets> | null = null;
let pulsarAvailable: boolean | null = null;

function hasPulsar() {
  if (Platform.OS === "web") {
    return false;
  }

  if (pulsarAvailable != null) {
    return pulsarAvailable;
  }

  try {
    pulsarAvailable =
      Boolean(NativeModules.RNPulsar) ||
      Boolean(TurboModuleRegistry.get?.("RNPulsar"));
  } catch {
    pulsarAvailable = false;
  }

  return pulsarAvailable;
}

function getPresets() {
  presetsPromise ??= import("react-native-pulsar").then(
    (module) => module.Presets
  );
  return presetsPromise;
}

async function play(selectPreset: (presets: PulsarPresets) => HapticPreset) {
  if (!hasPulsar()) {
    return;
  }

  try {
    const presets = await getPresets();
    selectPreset(presets)();
  } catch {
    // Native haptics can be unavailable in simulators or unsupported devices.
  }
}

export const haptics = {
  press: () => void play((presets) => presets.System.selection),
  success: () => void play((presets) => presets.System.notificationSuccess),
  error: () => void play((presets) => presets.System.notificationError),
  warning: () => void play((presets) => presets.System.notificationWarning),
  impact: () => void play((presets) => presets.System.impactLight),
};
