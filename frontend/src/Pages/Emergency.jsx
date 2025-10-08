import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, MapPin, Phone, Mail, MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const Emergency = () => {
  const [sosActive, setSosActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [alertsSent, setAlertsSent] = useState([]);
  const [nearestHospitals, setNearestHospitals] = useState([]);

  const handleSOS = () => {
    setSosActive(true);
    handleGetLocation();
  };

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
            const response = await axios.get("http://localhost:4000/api/v4/location", {
              params: { lat: coords.lat, lng: coords.lng },
            });

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

  const handleCancel = () => {
    setSosActive(false);
    setAlertsSent([]);
    setLocation(null);
    setNearestHospitals([]);
    toast.info("Emergency alert cancelled");
  };
  

  return (
    <div className="min-h-screen bg-gradient-subtle">
    
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency SOS</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One click to alert your emergency contacts with your live location
          </p>
        </div>

        {!sosActive ? (
          <Card className="mb-8 border-4 border-emergency shadow-emergency">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <AlertCircle className="h-24 w-24 text-emergency mx-auto emergency-pulse" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Press in Case of Emergency</h2>
                  <p className="text-muted-foreground">
                    This will immediately alert all your emergency contacts with your current location
                  </p>
                </div>
                <Button
                  variant="emergency"
                  size="xl"
                  onClick={handleSOS}
                  className="w-full max-w-sm mx-auto text-lg font-bold shadow-glow emergency-pulse"
                >
                  <AlertCircle className="h-6 w-6" />
                  ACTIVATE EMERGENCY SOS
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 border-4 border-emergency shadow-emergency bg-emergency/5">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <AlertCircle className="h-24 w-24 text-emergency mx-auto emergency-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-full bg-emergency/20 animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emergency mb-2">EMERGENCY ALERT ACTIVE</h2>
                    <p className="text-muted-foreground">Your emergency contacts are being notified</p>
                  </div>

                  {location && (
                    <div className="p-4 bg-background rounded-lg max-w-md mx-auto">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <MapPin className="h-5 w-5 text-emergency" />
                        <span className="font-semibold">Current Location</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 max-w-md mx-auto">
                    {["SMS", "Email", "WhatsApp"].map((method) => (
                      <div
                        key={method}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          alertsSent.includes(method)
                            ? "bg-success/10 border border-success"
                            : "bg-muted border border-transparent"
                        }`}
                      >
                        {alertsSent.includes(method) && <Check className="h-5 w-5 text-success" />}
                        <span className="font-medium">{method} Alert</span>
                        <span className="ml-auto text-sm">
                          {alertsSent.includes(method) ? "Sent" : "Sending..."}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="lg" onClick={handleCancel} className="mt-6">
                    Cancel Alert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nearest Hospitals List */}
            {nearestHospitals.length > 0 && (
              <Card className="mb-8 shadow-card">
                <CardHeader>
                  <CardTitle>Nearest Hospitals</CardTitle>
                  <CardDescription>Top 5 nearest hospitals from your location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nearestHospitals.map((hospital, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{hospital.name}</h4>
                        <p className="text-sm text-muted-foreground">{hospital.address}</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Emergency;





































// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   AlertCircle,
//   MapPin,
//   Phone,
//   Check,
//   MessageSquare,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Navbar from "./Navbar";

// const Emergency = () => {
//   const [sosActive, setSosActive] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [alertsSent, setAlertsSent] = useState([]);
//   const [nearestHospitals, setNearestHospitals] = useState([]);
//   const [emergencyContacts, setEmergencyContacts] = useState([]);

//   // 🟩 Fetch emergency contacts from backend
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/api/v3/profile", {
//           withCredentials: true,
//         });
        
//         // console.log("here is response",res);
        

//         if (res.data && res.data.contactDetails) {
//           setEmergencyContacts(res.data.contactDetails);
//           console.log("Contacts fetched:", res.data.contactDetails);
//         } else {
//           toast.warn("No emergency contacts found in your profile");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch emergency contacts");
//       }
//     };

//     fetchContacts();
//   }, []);

//   const handleSOS = () => {
//     setSosActive(true);
//     handleGetLocation();
//   };

//   const handleGetLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const coords = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };

//           setLocation(coords);
//           toast.success("✅ Location fetched successfully!");

//           // 🟨 Get nearest hospitals (optional)
//           try {
//             const response = await axios.get(
//               "http://localhost:4000/api/v4/location",
//               { params: { lat: coords.lat, lng: coords.lng } }
//             );

//             if (response.data.data && response.data.data.length > 0) {
//               setNearestHospitals(response.data.data);
//             }
//           } catch (error) {
//             console.error(error);
//           }

//           // 🟩 Send WhatsApp alerts to all emergency contacts
//           sendWhatsAppAlert(coords);
//         },
//         (error) => {
//           toast.error("❌ Unable to get location");
//           console.error(error);
//           setSosActive(false);
//         }
//       );
//     } else {
//       toast.error("❌ Geolocation not supported by this browser");
//       setSosActive(false);
//     }
//   };

//   const sendWhatsAppAlert = (coords) => {
//     if (emergencyContacts.length === 0) {
//       toast.error("No emergency contacts found!");
//       return;
//     }

//     emergencyContacts.forEach((contact) => {
//       const phone = contact.phoneNumber.replace(/\D/g, ""); // clean number
//       const message = encodeURIComponent(
//         `🚨 *Emergency Alert!*\n\n` +
//           `Name: ${contact.name}\n` +
//           `Relation: ${contact.relation}\n\n` +
//           `My current location:\nhttps://www.google.com/maps?q=${coords.lat},${coords.lng}\n\n` +
//           `Please contact me immediately.`
//       );

//       const whatsappURL = `https://wa.me/${phone}?text=${message}`;
//       window.open(whatsappURL, "_blank");
//     });

//     setAlertsSent(["WhatsApp"]);
//     toast.success("📲 WhatsApp alerts opened for all contacts!");
//   };

//   const handleCancel = () => {
//     setSosActive(false);
//     setAlertsSent([]);
//     setLocation(null);
//     setNearestHospitals([]);
//     toast.info("Emergency alert cancelled");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <Navbar />
//       <div className="container mx-auto px-4 py-12 max-w-4xl">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency SOS</h1>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             One click to alert your emergency contacts with your live location
//           </p>
//         </div>

//         {!sosActive ? (
//           <Card className="mb-8 border-4 border-emergency shadow-emergency">
//             <CardContent className="py-12">
//               <div className="text-center space-y-6">
//                 <AlertCircle className="h-24 w-24 text-emergency mx-auto emergency-pulse" />
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">
//                     Press in Case of Emergency
//                   </h2>
//                   <p className="text-muted-foreground">
//                     This will immediately alert all your emergency contacts via
//                     WhatsApp with your current location.
//                   </p>
//                 </div>
//                 <Button
//                   variant="emergency"
//                   size="xl"
//                   onClick={handleSOS}
//                   className="w-full max-w-sm mx-auto text-lg font-bold shadow-glow emergency-pulse"
//                 >
//                   <AlertCircle className="h-6 w-6" />
//                   ACTIVATE EMERGENCY SOS
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           <>
//             <Card className="mb-8 border-4 border-emergency shadow-emergency bg-emergency/5">
//               <CardContent className="py-12 text-center space-y-6">
//                 <div className="relative">
//                   <AlertCircle className="h-24 w-24 text-emergency mx-auto emergency-pulse" />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="h-32 w-32 rounded-full bg-emergency/20 animate-ping" />
//                   </div>
//                 </div>

//                 <h2 className="text-2xl font-bold text-emergency mb-2">
//                   EMERGENCY ALERT ACTIVE
//                 </h2>
//                 <p className="text-muted-foreground">
//                   WhatsApp messages are being sent to your emergency contacts
//                 </p>

//                 {location && (
//                   <div className="p-4 bg-background rounded-lg max-w-md mx-auto">
//                     <div className="flex items-center gap-2 justify-center mb-2">
//                       <MapPin className="h-5 w-5 text-emergency" />
//                       <span className="font-semibold">Current Location</span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       Lat: {location.lat.toFixed(6)}, Lng:{" "}
//                       {location.lng.toFixed(6)}
//                     </p>
//                   </div>
//                 )}

//                 <div className="space-y-3 max-w-md mx-auto">
//                   <div
//                     className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
//                       alertsSent.includes("WhatsApp")
//                         ? "bg-success/10 border border-success"
//                         : "bg-muted border border-transparent"
//                     }`}
//                   >
//                     {alertsSent.includes("WhatsApp") && (
//                       <Check className="h-5 w-5 text-success" />
//                     )}
//                     <MessageSquare className="h-5 w-5 text-green-600" />
//                     <span className="font-medium">WhatsApp Alert</span>
//                     <span className="ml-auto text-sm">
//                       {alertsSent.includes("WhatsApp") ? "Sent" : "Sending..."}
//                     </span>
//                   </div>
//                 </div>

//                 <Button variant="outline" size="lg" onClick={handleCancel}>
//                   Cancel Alert
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Nearest Hospitals List */}
//             {nearestHospitals.length > 0 && (
//               <Card className="mb-8 shadow-card">
//                 <CardHeader>
//                   <CardTitle>Nearest Hospitals</CardTitle>
//                   <CardDescription>
//                     Top 5 nearest hospitals from your location
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {nearestHospitals.map((hospital, index) => (
//                     <div
//                       key={index}
//                       className="p-4 bg-muted rounded-lg flex justify-between items-center"
//                     >
//                       <div>
//                         <h4 className="font-semibold">{hospital.name}</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {hospital.address}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Distance: {hospital.distance.toFixed(2)} km
//                         </p>
//                       </div>
//                       <Button variant="medical" size="sm">
//                         <Phone className="h-4 w-4" />
//                         Call
//                       </Button>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Emergency;

