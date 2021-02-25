import axios from 'axios';

const createAxios = ({ req }) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers // server doesn't know about host, cookies etc, so we have to pass req.headers
  });
};

export default createAxios;
