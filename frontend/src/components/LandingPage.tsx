import axios from "axios"
import React, { useEffect } from "react"
import type { Activity } from "../types/Activity"

function LandingPage () {

    const [activities, setActivities] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/act');
            console.log(response.data); 
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }   
    }

    useEffect(() => {
        setIsLoading(true)
        fetchData();
        setIsLoading(false)
    }, []);

    return (
        <>
        <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-semibold mx-auto my-5 text-emerald-600">กิจกรรม</h1>
            {isLoading && <p className="text-gray-500 mx-auto">กำลังโหลด...</p>}
            <ul className="grid grid-cols-4 gap-4 justify-between mx-5">
                {activities.map((activity: Activity) => (
                    <>
                    <li key={activity.id}>
                        <div className="border rounded p-4 h-75 w-75 flex flex-col justify-start">
                            <h2 className="font-semibold text-lg">{activity.title}</h2>
                            <p className="text-sm text-gray-700">{activity.description}</p>
                            <p className="text-sm text-gray-600"><b>เริ่ม:</b> {activity.start_date}</p>
                            <p className="text-sm text-gray-600"><b>สิ้นสุด:</b> {activity.end_date}</p>
                            <div className="mt-auto flex justify-between items-center">
                                <p className="text-sm text-gray-500">{activity.organizer}</p>
                                <div className="flex flex-col gap-0.5">
                                    {activity.occupied === activity.slots ? 
                                        <p className="text-red-500 flex justify-center">เต็ม</p>
                                    :
                                        <p className="text-gray-600 flex justify-center">{activity.occupied}/{activity.slots}</p>
                                    }                                    
                                    <button className="bg-emerald-500 p-2 rounded flex text-white cursor-pointer">เข้าร่วม</button>
                                </div>                            
                            </div> 
                        </div>
                    </li>

                    </>

                ))}
            </ul>
        </div>
        </>
    )
}

export default LandingPage