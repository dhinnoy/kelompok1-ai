import axios from "axios";

const API_URL = "https://ppfcmisenvjiwdivenvl.supabase.co/rest/v1/Kucing";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZmNtaXNlbnZqaXdkaXZlbnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzI1MjAsImV4cCI6MjA2NjQ0ODUyMH0.jh4xIop9_aP6F0AtBFxT1dl6wRNuq9XUIKDc3at9b5k";

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export const MainAPI = {
  async fetchKucing() {
    const response = await axios.get(API_URL, { headers });
    return response.data;
  },

  async fetchKucingJoin() {
    const response = await axios.get(`${API_URL}?select=*,Cluster(label)`, {
      headers,
    });
    return response.data;
  },

  async createKucing(data) {
    const response = await axios.post(API_URL, data, { headers });
    return response.data;
  },
};
