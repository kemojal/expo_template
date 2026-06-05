import { Platform } from "react-native";
import { Presets } from "react-native-pulsar";

type HapticPreset = () => void;

function play(preset: HapticPreset) {
  if (Platform.OS === "web") {
    return;
  }

  try {
    preset();
  } catch {
    // Native haptics can be unavailable in simulators or unsupported devices.
  }
}

export const haptics = {
  press: () => play(Presets.System.selection),
  success: () => play(Presets.System.notificationSuccess),
  error: () => play(Presets.System.notificationError),
  warning: () => play(Presets.System.notificationWarning),
  impact: () => play(Presets.System.impactLight),
};
