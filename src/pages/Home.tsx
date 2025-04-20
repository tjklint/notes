import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import { Link } from 'react-router-dom';
import Banner from '../components/banner/Banner';
import NotesBanner from '../components/notesBanner/NotesBanner';

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <NotesBanner />
    </div>
  );
};

export default Home;
