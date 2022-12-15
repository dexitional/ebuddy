const fs = require("fs");
const path = require("path");
//const sms = require("../config/sms");
const API = require("../model/apiModelSupabase");
import { NextApiRequest, NextApiResponse } from 'next';

export default {
 
  /* AUTHENTICATION */
  authenticateAdmin: async (req:NextApiRequest, res:NextApiResponse) => {
    const { username,password } = req.body;
    try {
      var user = await API.verifyAdmin(username,password);
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "Authentication failed!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  authenticateVoter: async (req:NextApiRequest, res:NextApiResponse) => {
    const { username,password } = req.body;
    try {
      var user = await API.verifyVoter(username,password);
      console.log(user)
      if (user) {
        if(user.voted == 1) {
          res.status(200).json({
            success: false,
            msg: "You have Voted !!",
          });
        }else{
            const data = { ...user, photo: `/api/photos/?tag=${encodeURIComponent(username)}` }
            res.status(200).json({ success: true, data });
        } 
      }else{
        res.status(200).json({
          success: false,
          msg: "Wrong Voter Credentials!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchTest: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var data = await API.fetchTest();
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  /* ACTIVATION */

  activateVoter: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { verify } = req.query
      var data = await API.activateVoter(verify);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data !",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },
  
  /* ELECTIONS */
  fetchElectionByVoter: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { username } = req.query
      var data = await API.fetchElectionByVoter(username);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data !",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchElectionDataByVoter: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { username } = req.query
      var data = await API.fetchElectionDataByVoter(username);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data !",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },


  fetchElectionByCentre: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { cid } = req.query
      var data = await API.fetchElectionByCentre(cid);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchElectionByActiveCentre: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var data = await API.fetchElectionByActiveCentre();
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  postVoteStatus: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { finvote, username } = req.query;
      var data = await API.postVoteStatus(finvote,username);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchVotersByActiveCentre: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { search, page } = req.query;
      var data = await API.fetchVotersByActiveCentre(search,page);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  

  
  fetchVerifiedByActiveCentre: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var data = await API.fetchVerifiedByActiveCentre();
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchElectionDataById: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { eid,username } = req.query
      var data = await API.fetchElectionDataById(eid,username);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  /* VOTING & RECEIPT */
  postData: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var resp = await API.postVoteData(req.body);
      console.log(resp)
      res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchReceipt: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { rid,username } = req.query
      var data = await API.fetchReceipt(rid,username);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  /* ACTIVATION & VERIFICATION */
  /* RESULTS & AGREEMENT */

  /* MONITOR & STRONGROOM */
  fetchMonitor: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { mid } = req.query
      var data = await API.fetchMonitor(mid);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  /* CONTROLS */
  updateControl: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { id, data } = req.body;
      var resp = await API.updateControl(id, data);
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      } else {
        res
          .status(200)
          .json({ success: false, data: null, msg: "Please Check settings!" });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  /* VOTERS & REGISTER */
  fetchRegister:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { gid } = req.query
      var data = await API.fetchRegister(gid);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },
  /* CANDIDATES */
  /* PORTFOLIOS */

  /* CENTRES */
  activateCentre:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { activatecentre } = req.query
      var data = await API.activateCentre(activatecentre);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },


  loadCentre:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { loadcentre } = req.query
      var data = await API.loadCentreData(loadcentre);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  loadCentrePhotos:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { loadphoto } = req.query
      var data = await API.loadCentrePhotos(loadphoto);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  resetCentreElections:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      const { reset } = req.query
      var data = await API.resetCentreElections(reset);
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  fetchCentres:  async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var data = await API.fetchCentres();
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(200).json({
          success: false,
          data: null,
          msg: "No Data!",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },
  
  /* PHOTOS */
  
  fetchPhoto: async (req:any, res:any) => {
    const { eid,tag } = req.query
    var pic = await API.fetchPhoto(tag, eid); // Photo
    if (pic && pic.length > 0) {
      //var filepath = path.join(__dirname, "/../../../../public", pic[0]?.path);
      var filepath = path.join("./public", pic[0]?.path);
      console.log(filepath);
      console.log(__dirname);
      try {
        var stats = fs.statSync(filepath);
        if (stats) {
          res.setHeader('Content-Type', 'image/jpg')
          res
            .status(200)
            .send(fs.readFileSync(path.join("./public", pic[0]?.path)));
        } else {
          res.setHeader('Content-Type', 'image/png')
          res
            .status(200)
            .send(fs.readFileSync((path.join("./public", "none.png"))));
        }
      } catch (e) {
        console.log(e);
        res.setHeader('Content-Type', 'image/png')
        res
          .status(200)
          .send(fs.readFileSync(path.join("./public/upload", "none.png")));
      }
    } else {
      res.setHeader('Content-Type', 'image/png')
      res
        .status(200)
        .send(fs.readFileSync(path.join("./public/upload", "none.png")));
    }
  },


  /*
  fetchPhoto: async (req:any, res:any) => {
    const { eid,tag } = req.query
    var pic = await API.fetchPhoto(tag, eid); // Photo
    if (pic && pic.length > 0) {
      var filepath = path.join(__dirname, "/../../../../backend", pic[0]?.path);
      console.log(filepath);
      try {
        var stats = fs.statSync(filepath);
        if (stats) {
          res.setHeader('Content-Type', 'image/jpg')
          res
            .status(200)
            .send(fs.readFileSync(path.join(__dirname, "/../../../../backend", pic[0]?.path)));
        } else {
          res.setHeader('Content-Type', 'image/png')
          res
            .status(200)
            .send(fs.readFileSync((path.join(__dirname, "/../../../../backend", "none.png"))));
        }
      } catch (e) {
        console.log(e);
        res.setHeader('Content-Type', 'image/png')
        res
          .status(200)
          .send(fs.readFileSync(path.join(__dirname, "/../../../../backend/upload", "none.png")));
      }
    } else {
      res.setHeader('Content-Type', 'image/png')
      res
        .status(200)
        .send(fs.readFileSync(path.join(__dirname, "/../../../../backend/upload", "none.png")));
    }
  },
  */

  postEvsPhoto: async (req:any, res:any) => {
    var { id, election_id } = req.body;
    //var imageBuffer = decodeBase64Image(req.body.photo);
    var spath = `./public/cdn/photo/evs/${election_id}`;
    const file = id == "logo" ? `${spath}/${id}.png` : `${spath}/${id}.jpg`;
    console.log(file);
    //fs.writeFile(file, imageBuffer.data, async function (err) {
    fs.writeFile(file, req.body.photo.data, async function (err:any) {
      if (err) {
        console.log(err);
        res
          .status(200)
          .json({ success: false, data: null, msg: "Photo not saved!" });
      }
      // Update Database
      /*
      const photo =
        id == "logo"
          ? `./public/cdn/photo/evs/${election_id}/${id}.png`
          : `./public/cdn/photo/evs/${election_id}/${id}.jpg`;
      const query =
        id == "logo"
          ? `update ehub_vote.election set logo = '${photo}'"`
          : `update ehub_vote.candidate set photo = '${photo}'"`;
      const result = await db.query(query);
      res.status(200).json({ success: true, data: result });
      */
    });
  },

  /* CONTROLS */
  saveControl: async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      var resp = await API.saveControl(req.body);
      res.status(200).json({ success: true, resp });
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, data: null, msg: "Please Check settings!" });
    }
  },

  
};
