import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ExamPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(null);
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startExam = async () => {
            try {
                // Get Test Data first to show questions (Assuming backend sends questions)
                // In my backend implementation, test details are not sent in attempt. 
                // I need to fetch test details separately or rely on what attempt returns?
                // Wait, attempt logic in backend: startAttempt just creates attempt. 
                // So I need to fetch test details to get questions.
                
                const testRes = await api.get(`/tests/${testId}`);
                setTest(testRes.data);

                const attemptRes = await api.post(`/exam/attempt/${testId}`);
                setAttempt(attemptRes.data);
                
                // If attempt is already completed, show results?
                if (attemptRes.data.status === 'completed') {
                    alert('You have already completed this test.');
                    navigate('/');
                }

                setLoading(false);
            } catch (error) {
                alert(error.response?.data?.message || 'Error starting exam');
                navigate('/');
            }
        };
        startExam();
    }, [testId, navigate]);

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const handleSubmit = async () => {
        if (!window.confirm('Are you sure you want to submit?')) return;
        
        try {
            const formattedAnswers = Object.entries(answers).map(([qid, oid]) => ({
                questionId: qid,
                selectedOption: oid
            }));

            await api.post(`/exam/submit/${attempt._id}`, { answers: formattedAnswers });
            alert('Test Submitted Successfully');
            navigate('/');
        } catch (error) {
            alert('Error submitting test');
        }
    };

    if (loading) return <div>Starting Test...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>{test.title}</h2>
                <div>Time Left: (TODO)</div>
            </div>
            
            {test.questions.map((q, index) => (
                <div key={q._id} className="card" style={{ marginBottom: '1rem' }}>
                    <h4>Q{index + 1}: {q.questionText}</h4>
                    {q.options.map((opt, oIndex) => (
                        <div key={oIndex} style={{ margin: '0.5rem 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name={q._id} 
                                    checked={answers[q._id] === oIndex}
                                    onChange={() => handleOptionSelect(q._id, oIndex)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                {opt}
                            </label>
                        </div>
                    ))}
                </div>
            ))}

            <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%', marginTop: '2rem' }}>
                Submit Test
            </button>
        </div>
    );
};

export default ExamPage;
