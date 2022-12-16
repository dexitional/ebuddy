import useEffect from "react";
import axios from "axios";
import https from 'https';

export const getImage = async (url, imgpath, fs) => {
  try{
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios({url,httpsAgent,responseType: 'stream'})
    const data = response.data.pipe(fs.createWriteStream(imgpath));
  } catch (e){
    console.log(e)
  }
};

export const verifyVoter = async ({ username,password }) => {
  const res = await axios.post(`/api/auth/voter`, { username,password });
  return res.data;
};

export const verifyAdmin = async ({ username, password }) => {
  const res = await axios.post(`/api/auth/admin`, {
    username,
    password,
  });
  return res.data;
}; 

// ELECTION REQUESTS

export const fetchElectionByActiveCentre = async () => {
  const res = await axios.get(`/api/election?centre=staged`);
  return res.data;
}; 

export const fetchElectionByVoter = async (username) => {
  const res = await axios.get(`/api/election?username=${encodeURIComponent(username)}`);
  return res.data;
}; 
export const fetchElectionDataByVoter = async (username) => {
  const res = await axios.get(`/api/election?edata=all&username=${encodeURIComponent(username)}`);
  return res.data;
}; 

export const fetchElectionDataById = async (eid,username) => {
  const res = await axios.get(`/api/election?eid=${eid}&username=${encodeURIComponent(username)}`);
  return res.data;
}; 

export const fetchVerifiedByActiveCentre = async () => {
  const res = await axios.get(`/api/election?verify=true`);
  return res.data;
};


export const resetCentreElections = async (id) => {
  const res = await axios.get(`/api/centres?reset=${id}`);
  return res.data;
};


export const fetchMonitor = async (mid) => {
  const res = await axios.get(`/api/election?mid=${mid}`);
  return res.data;
};

export const fetchRegister = async (rid) => {
  const res = await axios.get(`/api/election?gid=${rid}`);
  return res.data;
};

export const fetchVoters = async (query) => {
  const res = await axios.get(`/api/voters${query}`);
  return res.data;
};

export const activateVoter = async (id) => {
  const res = await axios.get(`/api/voters?verify=${id}`);
  return res.data;
};


export const sendToVoter = async (id) => {
  const res = await axios.get(`/api/voters?sendvoter=${id}`);
  return res.data;
};

export const finalizeVote = async (cid,tag) => {
  const res = await axios.get(`/api/election?finvote=${cid}&username=${tag}`);
  return res.data;
};

export const fetchReceipt = async (id,username) => {
  const res = await axios.get(`/api/election?rid=${id}&username=${encodeURIComponent(username)}`);
  return res.data;
};

export const postData = async (data) => {
  const res = await axios.post(`/api/election?action=vote`,{...data});
  return res.data;
}; 

export const saveAction = async (data) => {
  const res = await axios.post(`/api/controls`,{...data});
  return res.data;
}; 

// CENTRES
export const setupVoters = async (id) => {
  const res = await axios.get(`/api/voters?setid=${id}`);
  return res.data;
};

export const activateCentre = async (id) => {
  const res = await axios.get(`/api/centres?activatecentre=${id}`);
  return res.data;
};


export const loadCentre = async (id) => {
  const res = await axios.get(`/api/centres?loadcentre=${id}`);
  return res.data;
};

export const loadPhoto = async (id) => {
  const res = await axios.get(`/api/centres?loadphoto=${id}`);
  return res.data;
};

export const fetchCentres = async (id) => {
  const res = await axios.get(`/api/centres`);
  return res.data;
};


export const sendCredentials = async (id) => {
  const res = await axios.get(`/api/centres?sendvoters=${id}`);
  return res.data;
};



// EVS ENDPOINTS

export const fetchEvsData = async (id, tag) => {
  const res = await axios.get(`${API_URL}/evs/data/${id}/${tag}`);
  return res.data;
};

export const fetchEvsUpdate = async (tag) => {
  const res = await axios.get(`${API_URL}/evs/update/${tag}`);
  return res.data;
};

export const fetchEvsReceipt = async (id, tag) => {
  const res = await axios.get(`${API_URL}/evs/receipt/${id}/${tag}`);
  return res.data;
};

export const fetchEvsRegister = async (id) => {
  const res = await axios.get(`${API_URL}/evs/register/${id}`);
  return res.data;
};

export const fetchEvsMonitor = async (id) => {
  const res = await axios.get(`${API_URL}/evs/monitor/${id}`);
  return res.data;
};

export const postEvsData = async (data) => {
  const res = await axios.post(`${API_URL}/evs/data`, { ...data });
  return res.data;
};

export const updateEvsControlData = async (data) => {
  const res = await axios.post(`${API_URL}/evs/setcontrol`, { ...data });
  return res.data;
};

export const deleteElector = async (id, tag) => {
  const res = await axios.delete(`${API_URL}/evs/deletevoter/${id}/${tag}`);
  return res.data;
};

export const addElector = async (data) => {
  const res = await axios.post(`${API_URL}/evs/addvoter`, { ...data });
  return res.data;
};

export const deletePortfolio = async (id) => {
  const res = await axios.delete(`${API_URL}/evs/deleteportfolio/${id}`);
  return res.data;
};

export const savePortfolio = async (data) => {
  const res = await axios.post(`${API_URL}/evs/saveportfolio`, { ...data });
  return res.data;
};

export const sellVoucher = async (data) => {
  const res = await axios.post(`${API_URL}/evs/sellvouch`, { ...data });
  return res.data;
};
