import { useExperience } from '../../lib/experienceContext'

export default function RoomThemePicker() {
  const { preferences, updatePreferences } = useExperience()
  return (
    <label className="room-theme-picker">
      <span>Homepage theme</span>
      <select
        value={preferences.roomTheme}
        onChange={(event) =>
          updatePreferences({ roomTheme: event.target.value })
        }
      >
        <option value="blue">Blue hour</option>
        <option value="cream">Warm studio</option>
        <option value="slate">Slate evening</option>
      </select>
    </label>
  )
}
