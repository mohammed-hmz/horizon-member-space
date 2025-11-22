"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import JoinRequest, { UserRequest } from "@/components/tables/requests";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/config";
import Spinner from "@/components/ui/spinner";
export default function BasicTables() {
      const [requests, setRequests] = useState<UserRequest[]>([]);
      const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(firebaseDb, "signupRequests"));
      const convertedRequests = snapshot.docs.map((doc) => {
        //bah mysrach problem t3 hydration date in client side
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        message: data.message || "",
        year: data.year || "",
        status: data.status || "",
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : "",
    };
  });
      setRequests(convertedRequests);
        setLoading(false);
      console.log("Fetched requests:", snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
        {loading ? <div className="flex justify-center py-6"><Spinner size="lg" color="black" /></div> :(
            <JoinRequest userRequests={requests} />
        )}
        </ComponentCard>
      </div>
    </div>
  );
}
