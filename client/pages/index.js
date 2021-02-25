import createAxios from '../api/createAxios';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = createAxios(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
