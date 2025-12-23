import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CreateTest = () => {
    const [testData, setTestData] = useState({
        title: '',
        maxStudents: '',
        maxAttempts: 1,
        startTime: '',
        endTime: '',
    });
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 1 }
    ]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setTestData({ ...testData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 1 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tests', { ...testData, questions });
            navigate('/');
        } catch (error) {
            alert('Error creating test');
        }
    };

    return (
        <div className="container">
            <h2>Create New Test</h2>
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Test Details</h3>
                    <div className="input-group">
                        <label className="input-label">Title</label>
                        <input name="title" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Max Students</label>
                        <input name="maxStudents" type="number" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Max Attempts</label>
                        <input name="maxAttempts" type="number" className="form-control" onChange={handleChange} value={testData.maxAttempts} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Start Time</label>
                        <input name="startTime" type="datetime-local" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">End Time</label>
                        <input name="endTime" type="datetime-local" className="form-control" onChange={handleChange} required />
                    </div>
                </div>

                <h3>Questions</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="card" style={{ marginBottom: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Question {qIndex + 1}</label>
                            <input 
                                value={q.questionText} 
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} 
                                className="form-control" 
                                required 
                            />
                        </div>
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} style={{ marginBottom: '0.5rem' }}>
                                <input 
                                    placeholder={`Option ${oIndex + 1}`} 
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                        ))}
                        <div className="input-group">
                            <label className="input-label">Correct Option (0-3)</label>
                            <select 
                                value={q.correctOption} 
                                onChange={(e) => handleQuestionChange(qIndex, 'correctOption', parseInt(e.target.value))}
                                className="form-control"
                            >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                            </select>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addQuestion} className="btn" style={{ marginRight: '1rem' }}>Add Question</button>
                <button type="submit" className="btn btn-primary">Create Test</button>
            </form>
        </div>
    );
};

export default CreateTest;
