"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useRoom, useUpdateRoom, usePropertyTypes } from "@/hooks/useRooms";
import Alert from "@/components/ui/Alert";
import { Heart, MapPin } from "lucide-react";
import MapPicker from "@/components/MapPicker";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import "../../styles.css";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user } = useAuth();
  const { data: room, isLoading: loadingRoom } = useRoom(slug);
  const { data: propertyTypes, isLoading: loadingTypes } = usePropertyTypes();
  const updateRoom = useUpdateRoom();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(51.0447);
  const [longitude, setLongitude] = useState<number>(-114.0719);

  // Preview state
  const [preview, setPreview] = useState({
    propertyType: "Select Property Type",
    price: 0,
    address: "No address set",
    bedrooms: "",
    bathrooms: "",
    size: "",
    petsAllowed: false,
    parking: "",
    laundry: "",
    ac: "",
    heating: "",
  });

  // Initialize form data from room
  useEffect(() => {
    if (room) {
      // Extract coordinates
      const coordinates = typeof room.coordinates === 'string'
        ? JSON.parse(room.coordinates)
        : room.coordinates;

      setAddress(room.address || "");
      setLatitude(coordinates?.lat || 51.0447);
      setLongitude(coordinates?.lng || -114.0719);

      // Update preview
      setPreview({
        propertyType: room.property_type?.name || "Select Property Type",
        price: room.price_per_month || 0,
        address: room.address || "No address set",
        bedrooms: room.bedrooms?.toString() || "",
        bathrooms: room.bathrooms?.toString() || "",
        size: room.size || "",
        petsAllowed: room.pets_allowed || false,
        parking: room.parking_type || "",
        laundry: room.laundry_type || "",
        ac: room.air_conditioning || "",
        heating: room.heating_type || "",
      });
    }
  }, [room]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    // Latitude and longitude are already in formData from the inputs
    // Backend will convert them to a PostGIS Point

    try {
      await updateRoom.mutateAsync({ slug, formData });
      setSuccess("Listing updated successfully!");
      setTimeout(() => router.push("/landlord"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update listing.");
    }
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  }

  function updatePreview(field: string, value: any) {
    setPreview(prev => ({ ...prev, [field]: value }));
  }

  const heroUrl = thumbnail
    ? URL.createObjectURL(thumbnail)
    : room?.thumbnail || null;

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <Alert type="error">Please login to edit listings.</Alert>
      </div>
    );
  }

  if (loadingRoom) {
    return (
      <div className="marketplace-bg">
        <div className="marketplace-container">
          <p className="text-gray-500">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <Alert type="error">Listing not found.</Alert>
      </div>
    );
  }

  return (
    <div className="marketplace-bg">
      <div className="marketplace-container">
        {/* LEFT SIDE - FORM */}
        <div className="form-side">
          {error && (
            <div className="section-card">
              <div className="section-body">
                <Alert type="error">{error}</Alert>
              </div>
            </div>
          )}

          {success && (
            <div className="section-card">
              <div className="section-body">
                <Alert type="success">{success}</Alert>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* BASICS */}
            <div className="section-card">
              <div className="section-header">📝 Basic Information</div>
              <div className="section-body">
                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor="property_type">Property Type *</label>
                    <select
                      id="property_type"
                      name="property_type"
                      required
                      disabled={loadingTypes}
                      defaultValue={room.property_type?.id}
                      onChange={(e) => {
                        const text = e.target.options[e.target.selectedIndex].text;
                        updatePreview("propertyType", text);
                      }}
                      className="form-input"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes?.map((type: any) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      className="form-textarea"
                      placeholder="Describe your property..."
                      defaultValue={room.description || ""}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PHOTOS */}
            <div className="section-card">
              <div className="section-header">📷 Photos</div>
              <div className="section-body">
                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor="thumbnail">Update Cover Photo</label>
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="form-file"
                    />
                    {room.thumbnail && !thumbnail && (
                      <div className="helptext">Current: {room.thumbnail.split('/').pop()}</div>
                    )}
                  </div>
                </div>

                {heroUrl && (
                  <div className="photo-grid">
                    <div className="photo-slot">
                      <img src={heroUrl} alt="Cover" />
                      <div className="badge">Cover</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className="section-card">
              <div className="section-header">📍 Location</div>
              <div className="section-body">
                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor="address">Address *</label>
                    <AddressAutocomplete
                      value={address}
                      onChange={(value) => {
                        setAddress(value);
                        updatePreview("address", value);
                      }}
                      onPlaceSelect={(lat, lng, addr) => {
                        setLatitude(lat);
                        setLongitude(lng);
                        setAddress(addr);
                        updatePreview("address", addr);
                      }}
                      placeholder="Start typing address..."
                      className="form-input"
                    />
                    <input
                      type="hidden"
                      name="address"
                      value={address}
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>Click or drag marker to set location</label>
                    <MapPicker
                      latitude={latitude}
                      longitude={longitude}
                      onLocationChange={(lat, lng) => {
                        setLatitude(lat);
                        setLongitude(lng);
                      }}
                      className="w-full h-96"
                    />
                  </div>
                </div>

                <div className="field-row cols-2">
                  <div className="field-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      type="number"
                      id="latitude"
                      name="latitude"
                      step="any"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                      className="form-input"
                      placeholder="51.0447"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      type="number"
                      id="longitude"
                      name="longitude"
                      step="any"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                      className="form-input"
                      placeholder="-114.0719"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING & ROOM DETAILS */}
            <div className="section-card">
              <div className="section-header">💰 Pricing & Room Details</div>
              <div className="section-body">
                <div className="field-row cols-4">
                  <div className="field-group">
                    <label htmlFor="price_per_month">Price/Month *</label>
                    <input
                      type="number"
                      id="price_per_month"
                      name="price_per_month"
                      step="0.01"
                      min="0"
                      required
                      defaultValue={room.price_per_month}
                      className="form-input"
                      onChange={(e) => updatePreview("price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="bedrooms">Bedrooms *</label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      min="0"
                      required
                      defaultValue={room.bedrooms}
                      className="form-input"
                      onChange={(e) => updatePreview("bedrooms", e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="bathrooms">Bathrooms *</label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      min="0"
                      required
                      defaultValue={room.bathrooms}
                      className="form-input"
                      onChange={(e) => updatePreview("bathrooms", e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="size">Size (sq ft)</label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      className="form-input"
                      defaultValue={room.size || ""}
                      onChange={(e) => updatePreview("size", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-row cols-2">
                  <div className="field-group">
                    <label htmlFor="parking_type">Parking</label>
                    <select
                      id="parking_type"
                      name="parking_type"
                      className="form-input"
                      defaultValue={room.parking_type || ""}
                      onChange={(e) => updatePreview("parking", e.target.options[e.target.selectedIndex].text)}
                    >
                      <option value="">Select type</option>
                      <option value="garage">Garage</option>
                      <option value="street">Street</option>
                      <option value="off_street">Off-street</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="pets_allowed"
                        defaultChecked={room.pets_allowed}
                        onChange={(e) => updatePreview("petsAllowed", e.target.checked)}
                      />
                      Pets Allowed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* AMENITIES */}
            <div className="section-card">
              <div className="section-header">🏠 Amenities</div>
              <div className="section-body">
                <div className="field-row cols-2">
                  <div className="field-group">
                    <label htmlFor="laundry_type">Laundry</label>
                    <select
                      id="laundry_type"
                      name="laundry_type"
                      className="form-input"
                      defaultValue={room.laundry_type || ""}
                      onChange={(e) => updatePreview("laundry", e.target.options[e.target.selectedIndex].text)}
                    >
                      <option value="">Select type</option>
                      <option value="in_unit">In-unit</option>
                      <option value="laundry_in_building">In building</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="air_conditioning">Air Conditioning</label>
                    <select
                      id="air_conditioning"
                      name="air_conditioning"
                      className="form-input"
                      defaultValue={room.air_conditioning || ""}
                      onChange={(e) => updatePreview("ac", e.target.options[e.target.selectedIndex].text)}
                    >
                      <option value="">Select type</option>
                      <option value="central">Central</option>
                      <option value="available">Available</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                <div className="field-row cols-2">
                  <div className="field-group">
                    <label htmlFor="heating_type">Heating</label>
                    <select
                      id="heating_type"
                      name="heating_type"
                      className="form-input"
                      defaultValue={room.heating_type || ""}
                      onChange={(e) => updatePreview("heating", e.target.options[e.target.selectedIndex].text)}
                    >
                      <option value="">Select type</option>
                      <option value="central">Central</option>
                      <option value="electric">Electric</option>
                      <option value="gas">Gas</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="duration">Min Stay (months)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      defaultValue={room.duration || 6}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="section-card">
              <div className="section-header">⚙️ Status</div>
              <div className="section-body">
                <div className="field-row">
                  <div className="field-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={room.is_active}
                      />
                      Active (visible to renters)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="submit-row">
              <button
                type="submit"
                disabled={updateRoom.isPending}
                className="btn-submit"
              >
                {updateRoom.isPending ? "Updating..." : "💾 Update Listing"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/landlord")}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="preview-side">
          <div className="preview-card">
            <div className="preview-header">👁️ Live Preview</div>
            <div className="preview-gallery">
              {heroUrl ? (
                <>
                  <img src={heroUrl} alt="Property" />
                  <div className="heart-icon">
                    <Heart size={22} />
                  </div>
                </>
              ) : (
                <>
                  <div className="heart-icon">
                    <Heart size={22} />
                  </div>
                  <span>No photo uploaded</span>
                </>
              )}
            </div>
            <div className="preview-info">
              <div className="preview-location">
                <MapPin size={16} />
                <span>{preview.address}</span>
              </div>

              <div className="preview-title">{preview.propertyType}</div>

              <div className="preview-meta">
                {preview.bedrooms && <span>🛏️ {preview.bedrooms}</span>}
                {preview.bathrooms && <span>🚿 {preview.bathrooms}</span>}
                {preview.petsAllowed && <span>🐾 Pets</span>}
              </div>

              <div className="preview-price-row">
                <span className="preview-price">${preview.price.toLocaleString()}</span>
                <span style={{ color: "#6b7280", fontSize: "15px" }}>/mo</span>
              </div>

              <div className="preview-details">
                {[
                  preview.size && `${preview.size} sq ft`,
                  preview.parking && preview.parking !== "Select type" && preview.parking,
                  preview.laundry && preview.laundry !== "Select type" && preview.laundry,
                  preview.ac && preview.ac !== "Select type" && `A/C: ${preview.ac}`,
                  preview.heating && preview.heating !== "Select type" && `Heat: ${preview.heating}`,
                ].filter(Boolean).join(" • ")}
              </div>

              <button className="preview-btn">View Listing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
