/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from 'react-router-dom';
import axios from 'axios';
import date from 'date-and-time';

const App = () => {
  return (
    <Router>
      <div
        css={[tw`flex flex-col justify-center items-center h-screen bg-dark`]}
      >
        <Switch>
          <Route path="/:id" children={<Child />} />
        </Switch>
      </div>
    </Router>
  );
};

function Child() {
  const now = new Date();
  const today = date.format(now, 'YYYY-MM-DD');
  let [dataShalat, setData] = useState({
    subuh: '',
    dhuha: '',
    dzuhur: '',
    ashar: '',
    maghrib: '',
    isya: '',
  });
  let { id } = useParams();
  const [status, setStatus] = useState();
  const [kotaku, setKota] = useState('');

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `https://api.banghasan.com/sholat/format/json/jadwal/kota/${id}/tanggal/${today}`,
        )
        .then((response) => {
          setData({
            subuh: response.data.jadwal.data.subuh,
            dhuha: response.data.jadwal.data.dhuha,
            dzuhur: response.data.jadwal.data.dzuhur,
            ashar: response.data.jadwal.data.ashar,
            maghrib: response.data.jadwal.data.maghrib,
            isya: response.data.jadwal.data.isya,
          });
        });
    })();
  }, [id]);

  // useEffect(() => {
  //   (async () => {
  //     const kota = await axios.get(
  //       `https://api.banghasan.com/sholat/format/json/kota`,
  //     );
  //     const kotaId = id;
  //     const dataKota = [kota.data.kota];
  //     const result = dataKota[0].find(({ id }) => id === `${kotaId}`);
  //     if (typeof result !== 'undefined') {
  //       setStatus(true);
  //       setKota(result.nama);
  //     } else {
  //       setStatus(false);
  //     }
  //   })();
  // }, [id]);

  useEffect(() => {
    (async () => {
      await axios
        .get(`https://api.banghasan.com/sholat/format/json/kota`)
        .then((response) => {
          const dataKota = [response.data.kota];
          const kotaId = id;
          const result = dataKota[0].find(({ id }) => id === `${kotaId}`);
          if (typeof result !== 'undefined') {
            setStatus(true);
            setKota(result.nama);
          } else {
            setStatus(false);
          }
        });
    })();
  }, [id]);

  return (
    <div tw="w-full flex-row max-w-xl bg-white shadow-lg overflow-hidden border-teal-400 border-4">
      <div
        className="header"
        tw="font-bold text-xl py-2 px-2 border-gray-400 border-b-4"
      >
        {kotaku}
      </div>
      {status ? (
        <div className="jadwal" tw="flex flex-row justify-center text-center">
          <div className="subuh" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.subuh}</p>
            <p tw="font-bold text-xl">Subuh</p>
          </div>
          <div className="dhuha" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.dhuha}</p>
            <p tw="font-bold text-xl">Dhuha</p>
          </div>
          <div className="dzuhur" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.dzuhur}</p>
            <p tw="font-bold text-xl">Dzuhur</p>
          </div>
          <div className="asar" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.ashar}</p>
            <p tw="font-bold text-xl">Ashar</p>
          </div>
          <div className="maghrib" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.maghrib}</p>
            <p tw="font-bold text-xl">Maghrib</p>
          </div>
          <div className="isya" tw="m-3">
            <p tw="font-bold text-2xl">{dataShalat.isya}</p>
            <p tw="font-bold text-xl">Isya'</p>
          </div>
        </div>
      ) : (
        <div className="info" tw="flex flex-row justify-center text-center">
          <p tw="text-2xl">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App;
