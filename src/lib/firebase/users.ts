import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseDb as db} from "@/lib/firebase/config";

// import { sendPasswordResetEmail } from "firebase/auth";
// import { adminAuth } from "./admin";
// export const addMember = async (name:string, email:string, ige:string, school:string,jobTitle:string) => {
//   try {
//   await addDoc(collection(db, "members"), {
//     name,
//     email,
//     ige: ige||"",
//     school, 
//     jobTitle,
//     createdAt: serverTimestamp(),
//   });
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// };



export const sendSignupRequest = async (name:string, email:string, message:string, major:string, year:string) => {
  try {
  await addDoc(collection(db, "signupRequests"), {
    name,
    email,
    message,
    major,
    year,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  } catch (error) {
    console.error("Error adding signup request: ", error);
   alert("Error sending signup request please try again later.");
  }
};

