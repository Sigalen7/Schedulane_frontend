import { useState } from "react";

function QuestionnairePage() {
  const [form, setForm] = useState({
    city: "",
    days: "",
    preferences: [],
    hotel_location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, value]
        : prev.preferences.filter((p) => p !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send this to backend later
    const formData = {
      city: form.city,
      days: form.days,
      preferences: form.preferences,
      hotel_location: form.hotel_location || null,
    };

    console.log("Submitted form:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Plan Your Trip 🌍</h1>

        {/* Destination City */}
        <div>
          <label className="block font-semibold mb-1">Destination City:</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Busan"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Number of Days */}
        <div>
          <label className="block font-semibold mb-1">Number of Travel Days:</label>
          <input
            type="number"
            name="days"
            value={form.days}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="w-full p-3 border border-gray-300 rounded-lg"
            min={1}
            max={7}
            required
          />
        </div>

        {/* Hotel Location (optional) */}
        <div>
          <label className="block font-semibold mb-1">Hotel Location (optional):</label>
          <input
            type="text"
            name="hotel_location"
            value={form.hotel_location}
            onChange={handleChange}
            placeholder="e.g. Busan Station"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Preferences (as checkboxes) */}
        <div>
          <label className="block font-semibold mb-1">Preferences:</label>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-2">
            {["Beaches", "Museums", "Food markets", "Shopping", "Parks", "Historical sites"].map(
              (pref) => (
                <label key={pref} className="flex items-center">
                  <input
                    type="checkbox"
                    value={pref.toLowerCase()}
                    checked={form.preferences.includes(pref.toLowerCase())}
                    onChange={handleCheckbox}
                    className="mr-2"
                  />
                  {pref}
                </label>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default QuestionnairePage;