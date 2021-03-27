import Link from 'next/link';
import Router from 'next/router';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(({ id, title, price }) => {
    return (
      <tr key={id}>
        <td>{title}</td>
        <td>${price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return currentUser ? (
    <>
      <div className='d-flex justify-content-between mb-4 mt-4'>
        <h1>Tickets</h1>
        <button className='btn btn-primary' onClick={() => Router.push('/tickets/new')}>
          Create New
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr key='table-header-row'>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
