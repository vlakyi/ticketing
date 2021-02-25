import Router from 'next/dist/next-server/server/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const SignOut = () => {
  var router = useRouter();

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
