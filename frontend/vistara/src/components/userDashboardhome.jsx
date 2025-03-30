import React from 'react'
import  { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';


function UserDashboardhome() {

    const data = [
        {
          name: 'day 1',
          uv: 4000,
          count: 2400,
          amt: 2400,
        },
        {
          name: 'day 2',
          uv: 3000,
          count: 1398,
          amt: 2210,
        },
        {
          name: 'day 3',
          uv: 2000,
          count: 9800,
          amt: 2290,
        },
        {
          name: 'day 4',
          uv: 2780,
          count: 3908,
          amt: 2000,
        },
        {
          name: 'day 5',
          uv: 1890,
          count: 4800,
          amt: 2181,
        },
        
      ];
     

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Events</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>3</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Annoucements</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Stories</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>3</h1>
            </div>
            
        </div>

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={100}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </main>
  )
}

export default UserDashboardhome