import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext()

export const FeedbackProvider = ({children}) => {
    const [feedback, setFeedback] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false
    })

    useEffect(() => {
        fetchFeedback()
    }, [])

    // fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch(`/feedback?_sort=id
        &_order=desc`)
        const data = await response.json()

        setFeedback(data)
        setIsLoading(false)
    }
    
    // Add feedback funtion
    const addFeedback = async (newFeedback) => {
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        })

        const data = await response.json()

        setFeedback([data, ...feedback])
    }
    
    // delete feedback function
    const deleteFeedback = async (id) => {
        if(window.confirm('Are you sure want to delete?')) {
            await fetch(`/feedback/${id}`, { method: 'DELETE'})
            setFeedback(feedback.filter((item) => item.id !== id ))
        }
    }

    // Set item to be edited
    const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
    }

    // update feedback item
    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updItem)
        })

        const data = await response.json()

        setFeedback(feedback.map((item) => item.id === id ? 
        {...item, ...data} : item))
    }

    return <FeedbackContext.Provider value={{
        feedback, feedbackEdit,isLoading,deleteFeedback, addFeedback, editFeedback, updateFeedback
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext