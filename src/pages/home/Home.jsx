import React from 'react';
import {Button, Input, Typography, Skeleton, Table} from 'antd';
import {Header} from 'antd/es/layout/layout';
import {GithubOutlined} from '@ant-design/icons';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import GaugeChart from 'react-gauge-chart';

const Home = () => {
  const [input, setInput] = React.useState('');
  const [intents, setIntents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const toFixed =
    (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
  const handleGetIntents = async () => {
    setIntents([]);
    setLoading(true);
    const body = {
      input,
    };
    axios.post('http://localhost:6003/api/classify', body)
        .then((response) => {
          const {intent_probabilities: orderedIntents} = response.data.intents;
          const tempIntents = [];
          orderedIntents.forEach((intent) => {
            const object = {
              name: intent[0],
              probability: toFixed(intent[1]*100, 4),
            };
            tempIntents.push(object);
            setLoading(false);
          });
          setIntents(tempIntents);
          console.log(tempIntents);
        }).catch((err) => {
          console.log(err);
        });
  };
  const handleInput = (value) => {
    setInput(value);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <Header style={{
        position: 'sticky',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#252525',
        top: 0,
      }}>
        <Typography
          style={{
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          {'Intent Classification'}
        </Typography>
        <GithubOutlined
          style={{
            fontSize: '2rem',
            color: 'white',
            marginRight: '1rem',
          }}
          onClick={() => window.open('https://github.com/onegoel/intent-classification')}
        />
      </Header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
        }}
      >
        <Input
          size='large'
          placeholder='Enter some text here...'
          style={{
            width: '50%',
          }}
          onChange={(e) => handleInput(e.target.value)}
        />
        <Button
          type='primary'
          size='large'
          style={{
            marginLeft: '1rem',
            backgroundColor: '#252525',
            color: 'white',
          }}
          onClick={() => handleGetIntents()}
          disabled={input.length === 0}
          loading={loading}
        >
          Get Intents
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2rem',
        }}
      >
        {loading && intents.length === 0 ? (
          <Skeleton
            active
            paragraph={{rows: 4}}
            style={{
              width: '50%',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <Table
              dataSource={intents}
              columns={[
                {
                  title: 'Intent',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Probability',
                  dataIndex: 'probability',
                  key: 'probability',
                },
              ]}
              scroll={{
                y: 300,
              }}
              style={{
                width: '50%',
              }}
              bordered
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={10}
                textColor='black'

                percent={intents[0] ? intents[0].probability / 100 : 0}
                style={{
                  width: '100%',
                }}
                needleColor='grey'
              />
              <Typography
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {intents[0] ? 'You most likely meant: ' + intents[0].name : ''}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
