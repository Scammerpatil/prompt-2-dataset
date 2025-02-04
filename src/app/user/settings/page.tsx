"use client";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/user";
import {
  IconUsers,
  IconMap,
  IconMessage,
  IconSettings,
  IconHelpCircle,
} from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg"
        style={{ width: "calc(70vw/3)" }}
        aria-label="Profile"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <Profile user={user} />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg"
        style={{ width: "calc(70vw/3)" }}
        aria-label="Something will go here"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 2
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg"
        style={{ width: "calc(70vw/3)" }}
        aria-label="Something will go here"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      ></div>
    </div>
  );
};

export default Settings;

const Profile = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    formData.profilePic || "/default-profile.png"
  );

  const availableLanguages = [
    "Hindi",
    "English",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Malayalam",
    "Punjabi",
    "Kannada",
    "Oriya",
    "Assamese",
    "Maithili",
    "Sanskrit",
  ];

  const popularDestinations = [
    "Goa",
    "Kerala",
    "Rajasthan",
    "Agra",
    "Shimla",
    "Leh-Ladakh",
    "Mysore",
    "Varanasi",
    "Manali",
    "Darjeeling",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.age) {
      alert("Please fill in all required fields");
      return;
    }
    const response = axios.patch("/api/user/update", { formData });
    toast.promise(response, {
      loading: "Updating User...",
      success: "User Update Successfully",
      error: "Something went wrong",
    });
    setIsEditing(false);
  };

  return (
    <form className="container mx-auto p-4" onSubmit={handleSubmit}>
      {/* Profile Image */}
      <div className="my-6">
        <div className="flex items-center gap-4">
          <img
            src={imagePreview}
            alt="Profile Pic"
            className="rounded-full h-40 w-40 object-cover border border-primary"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Personal Details */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="fullName"
            >
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="Full Name"
              disabled={!isEditing}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="Mobile Number"
              disabled={!isEditing}
            />
          </div>

          {/* Permanent Address */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="location"
            >
              Permanent Address
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="Permanent Address"
              disabled={!isEditing}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="gender"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender || ""}
              readOnly
              className="input input-bordered w-full text-base-content"
              placeholder="Gender"
              disabled
            />
          </div>

          {/* Languages */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="languages"
            >
              Languages <span className="text-error">*</span>
            </label>
            <select
              name="languages"
              multiple
              disabled={!isEditing}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  languages: formData.languages
                    ? [...formData.languages, e.target.value]
                    : [e.target.value],
                });
              }}
              value={formData.languages || []}
              className="input input-bordered w-full text-base-content"
              required
            >
              {availableLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Bio */}
        <div className="flex flex-col">
          <label className="text-base-content font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full text-base-content"
            placeholder="Tell something about yourself..."
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Tell About Your Travel Preferences
        </h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {/* Destinations */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="destinations"
            >
              Destination <span className="text-error">*</span>
            </label>
            <select
              name="destinations"
              multiple
              disabled={!isEditing}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  destinations: formData.destinations
                    ? [...formData.destinations, e.target.value]
                    : [e.target.value],
                });
              }}
              value={formData.destinations || []}
              className="input input-bordered w-full text-base-content"
              required
            >
              {popularDestinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Dates */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="travelDates.start"
            >
              Travel Date Start <span className="text-error">*</span>
            </label>
            <input
              type="date"
              id="travelDates.start"
              name="travelDates.start"
              value={
                formData.travelDates?.start &&
                !isNaN(new Date(formData.travelDates.start).getTime())
                  ? new Date(formData.travelDates.start)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => {
                setFormData({
                  ...formData,
                  travelDates: {
                    end: new Date(formData.travelDates?.start || ""),
                    start: new Date(e.target.value),
                  },
                });
              }}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="travelDates.end"
            >
              Travel Date End <span className="text-error">*</span>
            </label>
            <input
              type="date"
              id="travelDates.end"
              name="travelDates.end"
              value={
                formData.travelDates?.end &&
                !isNaN(new Date(formData.travelDates.end).getTime())
                  ? new Date(formData.travelDates.end)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => {
                setFormData({
                  ...formData,
                  travelDates: {
                    start: new Date(formData.travelDates?.start || ""),
                    end: new Date(e.target.value),
                  },
                });
              }}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
              required
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="budget"
            >
              Budget <span className="text-error">*</span>
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
              required
            >
              <option>Choose your budget</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Travel Style */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="travelStyle"
            >
              Travel Style
            </label>
            <select
              id="travelStyle"
              name="travelStyle"
              value={formData.travelStyle || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
            >
              <option>Choose your travel style</option>
              <option value="Backpacking">Backpacking</option>
              <option value="Luxury">Luxury</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          {/* Preferred Companion */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="preferredCompanion"
            >
              Preferred Companion
            </label>
            <select
              id="preferredCompanion"
              name="preferredCompanion"
              value={formData.preferredCompanion || ""}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
            >
              <option>Choose your preferred companion</option>
              <option value="Anyone">Anyone</option>
              <option value="Same Gender">Same Gender</option>
              <option value="Small Group">Small Group</option>
              <option value="Large Group">Large Group</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {/* Emergency Contact Name */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="emergencyContact.name"
            >
              Emergency Contact Name
            </label>
            <input
              type="text"
              id="emergencyContact.name"
              name="emergencyContact.name"
              value={formData.emergencyContact?.name || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  emergencyContact: {
                    ...formData.emergencyContact,
                    name: e.target.value,
                    phone: formData.emergencyContact?.phone || "",
                    relationship: formData.emergencyContact?.relationship || "",
                  },
                });
              }}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
            />
          </div>

          {/* Emergency Contact Phone */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="emergencyContact.phone"
            >
              Emergency Contact Phone
            </label>
            <input
              type="text"
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              value={formData.emergencyContact?.phone || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  emergencyContact: {
                    ...formData.emergencyContact,
                    name: formData.emergencyContact?.name || "",
                    phone: e.target.value,
                    relationship: formData.emergencyContact?.relationship || "",
                  },
                });
              }}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
            />
          </div>

          {/* Emergency Contact Relationship */}
          <div className="flex flex-col">
            <label
              className="text-base-content font-medium mb-1"
              htmlFor="emergencyContact.relationship"
            >
              Emergency Contact Relationship
            </label>
            <input
              type="text"
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact?.relationship || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  emergencyContact: {
                    ...formData.emergencyContact,
                    name: formData.emergencyContact?.name || "",
                    phone: formData.emergencyContact?.phone || "",
                    relationship: e.target.value,
                  },
                });
              }}
              className="input input-bordered w-full text-base-content"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Save/Cancel */}
      <div className="flex gap-4">
        {isEditing ? (
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );
};
