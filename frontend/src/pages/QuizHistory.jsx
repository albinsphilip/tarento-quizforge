import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {candidateAPI} from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function QuizHistory(){
    const navigate=useNavigate();
    const [user,setUser]=useState(null);
    const [myAttempts,setMyAttempts]=useState([]); //might need to use 'myAttempts'
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const userData=localStorage.getItem('user');
        const token=localStorage.getItem('token');

        if(!userData||!token) //might not need this check
        {
            navigate('/');
            return;
        }

        const parsedUser=JSON.parse(userData);
        if(parsedUser.role!=='CANDIDATE') //might not need this check
        {
            navigate('/admin');
            return;
        }

        setUser(parsedUser);
        fetchHistory();

    },[navigate]);

    const fetchHistory=async ()=>{
        try{
            const attempts=await candidateAPI.getMyAttempts();
            setMyAttempts(attempts);
        }
        catch(err){} //handle this properly
        finally{setLoading(false);}
    };

        if(loading) return <LoadingSpinner message="Loading quiz history"/>; //why this is here?

        return(
            <div className="flex h-screen bg-gray-50">
                <Sidebar role="CANDIDATE" currentPath="/candidate/history" userName={user?.name}/>

                <main className="flex-1 overflow-auto">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quiz History</h1>
                    </div>
                    {myAttempts.length===0?
                    (<div className="card py-16 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-6">history</span>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quiz History</h3>
                        <p className="text-gray-500">You haven't completed any quizzes yet.</p>
                    </div>)
                    :
                    (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quiz</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                  </table>
                  </div>
                  </div>
                  )
                    }
                </main>
            </div>
        );
}

export default QuizHistory;