
import React, { useState } from "react";
import axios from "axios";
import { MapPin, Phone, Star, Navigation } from "lucide-react";
import { toast } from "react-toastify";
// import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

function Hospital() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
  const [nearestHospitals, setNearestHospitals] = useState([]);

  // Load Google Maps script for the map background and markers

  // Get user's current location and then fetch hospitals from backend
  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setLocation(coords);
          toast.success("✅ Location fetched successfully!");

          try {
            const response = await axios.get(
              "http://localhost:4000/api/v4/location",
              {
                params: { lat: coords.lat, lng: coords.lng },
              }
            );

            console.log("Backend response:", response.data);

            if (response.data.data && response.data.data.length > 0) {
              setNearestHospitals(response.data.data); // store all hospitals
            }

            setAlertsSent(["SMS", "Email", "WhatsApp"]);
            toast.success("📍 Location & nearest hospitals sent to backend!");
          } catch (error) {
            console.error(error);
            toast.error("❌ Failed to send location to backend");
          }
        },
        (error) => {
          toast.error("❌ Unable to get location");
          console.error(error);
          setSosActive(false);
        }
      );
    } else {
      toast.error("❌ Geolocation not supported by this browser");
      setSosActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">🏥 Hospital Locator</h1>
        <p className="text-gray-500">
          Find nearby hospitals, emergency centers, and medical facilities with
          real-time info from our own database.
        </p>
      </div>

      {/* Show errors and status */}
      {/* {errorMsg && (
        <div className="max-w-2xl mx-auto bg-red-100 text-red-600 border border-red-300 rounded-xl p-3 mb-4 text-center">
          {errorMsg}
        </div>
      )} */}
      {/* {isLoading && (
        <div className="max-w-2xl mx-auto bg-blue-100 text-blue-600 border border-blue-300 rounded-xl p-3 mb-4 text-center">
          Loading hospitals near you...
        </div>
      )} */}

      {/* Location Button */}
      <div className="max-w-4xl mx-auto flex items-center gap-2 mb-6">
        <button
          onClick={handleGetLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
        >
          📍 Use My Location to Find Hospitals
        </button>
      </div>
      {nearestHospitals.length > 0 && (
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Nearest Hospitals</CardTitle>
            <CardDescription>
              Top 5 nearest hospitals from your location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearestHospitals.map((hospital, index) => (
              <div
                key={index}
                className="p-4 bg-muted rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{hospital.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {hospital.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Distance: {hospital.distance.toFixed(2)} km
                  </p>
                </div>
                <Button variant="medical" size="sm">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Map Section */}
      <div className="bg-white shadow rounded-2xl p-4 mb-8 max-w-4xl mx-auto text-center">
        {userLocation ? (
          <GoogleMap
            center={userLocation}
            zoom={13}
            mapContainerStyle={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
            }}
          >
            <MarkerF position={userLocation} />
            {hospitals.map((h, i) => (
              <MarkerF key={i} position={{ lat: h.lat, lng: h.lng }} />
            ))}
          </GoogleMap>
        ) : (
          <p className="text-gray-500">
            🗺️ Interactive Map
            <br />
            Map will show facilities once you use your location.
          </p>
        )}
      </div>

      {/* Hospital List */}
    </div>
  );
}

export default Hospital;
















// import React, { useEffect, useState } from "react";
// import { MapPin, Phone, Star, Navigation } from "lucide-react";
// import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

// function Hospital() {
//   const [userLocation, setUserLocation] = useState(null);

//   const hospitals = [
//     {
//       name: "City General Hospital",
//       address: "123 Medical Center Drive",
//       distance: "0.8 km",
//       rating: 4.5,
//       phone: "+1 (555) 123-4567",
//       services: ["Emergency", "ICU", "Surgery", "Cardiology"],
//       lat: 37.7749,
//       lng: -122.4194,
//     },
//     {
//       name: "St. Mary’s Medical Center",
//       address: "456 Healthcare Boulevard",
//       distance: "1.2 km",
//       rating: 4.8,
//       phone: "+1 (555) 245-6789",
//       services: ["Emergency", "Trauma", "Pediatrics", "Maternity"],
//       lat: 37.7785,
//       lng: -122.4212,
//     },
//     {
//       name: "Community Health Clinic",
//       address: "789 Wellness Street",
//       distance: "1.5 km",
//       rating: 4.3,
//       phone: "+1 (555) 365-8790",
//       services: ["General Medicine", "Diagnostics", "Pharmacy"],
//       lat: 37.7762,
//       lng: -122.4145,
//     },
//     {
//       name: "Metropolitan Emergency Center",
//       address: "271 UrgentCare Avenue",
//       distance: "2.1 km",
//       rating: 4.6,
//       phone: "+1 (555) 245-7821",
//       services: ["Emergency", "Radiology", "Urgent Care"],
//       lat: 37.7735,
//       lng: -122.4231,
//     },
//   ];

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyACBHGqo8N4ogDNiOJl5TnSFDYIQSUjtVY", // 🔑 Replace this with your API key
//   });

//   const handleLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) =>
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         }),
//       (err) => alert("Please enable location access")
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">🏥 Hospital Locator</h1>
//         <p className="text-gray-500">
//           Find nearby hospitals, emergency centers, and medical facilities with real-time info.
//         </p>
//       </div>

//       {/* Search Bar */}
//       <div className="max-w-4xl mx-auto flex items-center gap-2 mb-6">
//         <input
//           type="text"
//           placeholder="Search for hospitals, clinics, or medical centers..."
//           className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />
//         <button
//           onClick={handleLocation}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
//         >
//           📍 Use My Location
//         </button>
//       </div>

//       {/* Map Section */}
//       <div className="bg-white shadow rounded-2xl p-4 mb-8 max-w-4xl mx-auto text-center">
//         {isLoaded && userLocation ? (
//           <GoogleMap
//             center={userLocation}
//             zoom={13}
//             mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "12px" }}
//           >
//             <MarkerF position={userLocation} />
//             {hospitals.map((h, i) => (
//               <MarkerF key={i} position={{ lat: h.lat, lng: h.lng }} />
//             ))}
//           </GoogleMap>
//         ) : (
//           <p className="text-gray-500">🗺️ Interactive Map<br />Map will show hospital locations once you use your location.</p>
//         )}
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <p className="text-gray-700 mb-4">
//           Found {hospitals.length} medical facilities near you
//         </p>

//         {hospitals.map((h, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-2xl shadow mb-4 flex flex-col md:flex-row md:items-center justify-between"
//           >
//             <div>
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 {h.name}
//                 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">24/7 Emergency</span>
//               </h2>
//               <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
//                 <MapPin className="w-4 h-4" /> {h.address}
//               </p>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {h.services.map((s, i) => (
//                   <span key={i} className="bg-gray-100 text-sm px-3 py-1 rounded-lg">{s}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
//                 📞 {h.phone}
//               </p>
//             </div>

//             <div className="text-right mt-4 md:mt-0">
//               <p className="text-yellow-500 flex justify-end items-center gap-1 font-medium">
//                 <Star className="w-4 h-4" /> {h.rating}
//               </p>
//               <p className="text-gray-500 text-sm">{h.distance} away</p>
//               <div className="flex gap-2 mt-3 justify-end">
//                 <a href={`tel:${h.phone}`} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
//                   Call Now
//                 </a>
//                 <a
//                   href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
//                 >
//                   <Navigation className="w-4 h-4" /> Get Directions
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hospital;


// import React, { useEffect, useState } from "react";
// import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
// import { MapPin, Star, Navigation } from "lucide-react";

// function Hospital() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [hospitals, setHospitals] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_API_KEY_HERE", // replace with your key
//     libraries: ["places"], // important for Places API
//   });

//   // ✅ Get user location and load hospitals
//   const handleLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setUserLocation(loc);
//         fetchNearbyHospitals(loc);
//       },
//       () => alert("Please enable location access.")
//     );
//   };

//   // ✅ Fetch hospitals from Google Places API
//   const fetchNearbyHospitals = (loc) => {
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );

//     const request = {
//       location: new window.google.maps.LatLng(loc.lat, loc.lng),
//       radius: 5000, // 5km range
//       type: ["hospital"],
//       keyword: searchQuery || "hospital",
//     };

//     service.nearbySearch(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         const nearby = results.map((place) => ({
//           name: place.name,
//           address: place.vicinity,
//           rating: place.rating || "N/A",
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng(),
//           placeId: place.place_id,
//         }));
//         setHospitals(nearby);
//       } else {
//         console.warn("Places API error:", status);
//       }
//     });
//   };

//   // ✅ Handle search manually
//   const handleSearch = () => {
//     if (userLocation) {
//       fetchNearbyHospitals(userLocation);
//     } else {
//       alert("Please enable location first.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">🏥 Hospital Locator</h1>
//         <p className="text-gray-500">
//           Find nearby hospitals, clinics, and emergency centers near you.
//         </p>
//       </div>

//       {/* 🔍 Search Bar */}
//       <div className="max-w-4xl mx-auto flex items-center gap-2 mb-6">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search for hospital, clinic, or doctor..."
//           className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
//         >
//           🔍 Search
//         </button>
//         <button
//           onClick={handleLocation}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl"
//         >
//           📍 Use My Location
//         </button>
//       </div>

//       {/* 🗺️ Map Section */}
//       <div className="bg-white shadow rounded-2xl p-4 mb-8 max-w-4xl mx-auto text-center">
//         {isLoaded && userLocation ? (
//           <GoogleMap
//             center={userLocation}
//             zoom={14}
//             mapContainerStyle={{ width: "100%", height: "350px", borderRadius: "12px" }}
//           >
//             <MarkerF position={userLocation} title="You are here" />
//             {hospitals.map((h, i) => (
//               <MarkerF key={i} position={{ lat: h.lat, lng: h.lng }} title={h.name} />
//             ))}
//           </GoogleMap>
//         ) : (
//           <p className="text-gray-500">
//             🗺️ Map will appear after you enable location.
//           </p>
//         )}
//       </div>

//       {/* 🏥 Hospital List */}
//       <div className="max-w-4xl mx-auto">
//         <p className="text-gray-700 mb-4">
//           {hospitals.length
//             ? `Found ${hospitals.length} hospitals near you`
//             : "No hospitals found yet."}
//         </p>

//         {hospitals.map((h, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-2xl shadow mb-4 flex flex-col md:flex-row md:items-center justify-between"
//           >
//             <div>
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 {h.name}
//               </h2>
//               <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
//                 <MapPin className="w-4 h-4" /> {h.address}
//               </p>
//               <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
//                 ⭐ Rating: {h.rating}
//               </p>
//             </div>

//             <div className="text-right mt-4 md:mt-0">
//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 justify-center"
//               >
//                 <Navigation className="w-4 h-4" /> Get Directions
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hospital;

// import React, { useEffect, useState } from "react";
// import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
// import { MapPin, Star, Navigation } from "lucide-react";

// function Hospital() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [hospitals, setHospitals] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_API_KEY_HERE", // <-- Replace with your key
//     libraries: ["places"],
//   });

//   // Automatically prompt location access when page loads
//   useEffect(() => {
//     // Optionally call handleLocation here for auto-prompt:
//     // handleLocation();
//     // eslint-disable-next-line
//   }, []);

//   // Get user location & load hospitals
//   const handleLocation = () => {
//     if (!navigator.geolocation) {
//       setErrorMsg("Browser does not support geolocation.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setUserLocation(loc);
//         fetchNearbyHospitals(loc, searchQuery); // initial load for user
//         setErrorMsg("");
//       },
//       (err) => setErrorMsg("Please enable location access.")
//     );
//   };

//   // Fetch hospitals via Google Places API
//   const fetchNearbyHospitals = (loc, query) => {
//     if (!window.google || !window.google.maps) {
//       setErrorMsg("Google Maps API did not load. Please check API key.");
//       return;
//     }
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );
//     const request = {
//       location: new window.google.maps.LatLng(loc.lat, loc.lng),
//       radius: 5000,
//       type: ["hospital"],
//       keyword: query || "hospital",
//     };
//     service.nearbySearch(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         const nearby = results.map((place) => ({
//           name: place.name,
//           address: place.vicinity,
//           rating: place.rating || "N/A",
//           lat: typeof place.geometry.location.lat === "function"
//             ? place.geometry.location.lat()
//             : place.geometry.location.lat,
//           lng: typeof place.geometry.location.lng === "function"
//             ? place.geometry.location.lng()
//             : place.geometry.location.lng,
//           placeId: place.place_id,
//         }));
//         setHospitals(nearby);
//         setErrorMsg("");
//       } else {
//         setHospitals([]);
//         setErrorMsg("No hospitals found or Places API error: " + status);
//       }
//     });
//   };

//   // Handle manual search by input
//   const handleSearch = () => {
//     if (userLocation) {
//       fetchNearbyHospitals(userLocation, searchQuery);
//     } else {
//       setErrorMsg("Please enable location first.");
//     }
//   };

//   // Handle Enter key for input
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">🏥 Hospital Locator</h1>
//         <p className="text-gray-500">
//           Find nearby hospitals, clinics, and emergency centers near you.
//         </p>
//       </div>

//       {/* Show error message if any */}
//       {errorMsg && (
//         <div className="max-w-2xl mx-auto bg-red-100 text-red-600 border border-red-300 rounded-xl p-3 mb-4 text-center">{errorMsg}</div>
//       )}

//       {/* 🔍 Search/Input Section */}
//       <div className="max-w-4xl mx-auto flex items-center gap-2 mb-6">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search for hospital, clinic, doctor..."
//           className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
//         >
//           🔍 Search
//         </button>
//         <button
//           onClick={handleLocation}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl"
//         >
//           📍 Use My Location
//         </button>
//       </div>

//       {/* 🗺️ Map Section */}
//       <div className="bg-white shadow rounded-2xl p-4 mb-8 max-w-4xl mx-auto text-center">
//         {isLoaded && userLocation ? (
//           <GoogleMap
//             center={userLocation}
//             zoom={14}
//             mapContainerStyle={{ width: "100%", height: "350px", borderRadius: "12px" }}
//           >
//             <MarkerF position={userLocation} title="You are here" />
//             {hospitals.map((h, i) => (
//               <MarkerF key={i} position={{ lat: h.lat, lng: h.lng }} title={h.name} />
//             ))}
//           </GoogleMap>
//         ) : (
//           <p className="text-gray-500">
//             🗺️ Map will appear after you enable location.
//           </p>
//         )}
//       </div>

//       {/* 🏥 Hospital List */}
//       <div className="max-w-4xl mx-auto">
//         <p className="text-gray-700 mb-4">
//           {hospitals.length
//             ? `Found ${hospitals.length} hospitals near you`
//             : "No hospitals found yet."}
//         </p>
//         {hospitals.map((h, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-2xl shadow mb-4 flex flex-col md:flex-row md:items-center justify-between"
//           >
//             <div>
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 {h.name}
//               </h2>
//               <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
//                 <MapPin className="w-4 h-4" /> {h.address}
//               </p>
//               <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
//                 <Star className="w-4 h-4" /> Rating: {h.rating}
//               </p>
//             </div>
//             <div className="text-right mt-4 md:mt-0">
//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 justify-center"
//               >
//                 <Navigation className="w-4 h-4" /> Get Directions
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hospital;

//   <div className="max-w-4xl mx-auto">
//         <p className="text-gray-700 mb-4">
//           {hospitals.length
//             ? `Found ${hospitals.length} medical facilities near you`
//             : "No hospitals to show."}
//         </p>
//         {hospitals.map((h, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-2xl shadow mb-4 flex flex-col md:flex-row md:items-center justify-between"
//           >
//             <div>
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 {h.name}
//                 {h.emergency && (
//                   <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
//                     24/7 Emergency
//                   </span>
//                 )}
//               </h2>
//               <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
//                 <MapPin className="w-4 h-4" /> {h.address}
//               </p>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {h.services &&
//                   h.services.map((s, j) => (
//                     <span
//                       key={j}
//                       className="bg-gray-100 text-sm px-3 py-1 rounded-lg"
//                     >
//                       {s}
//                     </span>
//                   ))}
//               </div>
//               <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
//                 <Phone className="w-4 h-4" /> {h.phone}
//               </p>
//             </div>
//             <div className="text-right mt-4 md:mt-0">
//               <p className="text-yellow-500 flex justify-end items-center gap-1 font-medium">
//                 <Star className="w-4 h-4" /> {h.rating || "N/A"}
//               </p>
//               {h.distance && (
//                 <p className="text-gray-500 text-sm">{h.distance} away</p>
//               )}
//               <div className="flex gap-2 mt-3 justify-end">
//                 {h.phone && (
//                   <a
//                     href={`tel:${h.phone}`}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
//                   >
//                     Call Now
//                   </a>
//                 )}
//                 <a
//                   href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
//                 >
//                   <Navigation className="w-4 h-4" /> Get Directions
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}



//       </div>
