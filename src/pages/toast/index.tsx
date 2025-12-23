import { useToast } from "@/components/Toast/inde"

const ToastPage = () => {
    const { success, error, warning, info } = useToast()

    return (
        <div className="flex  gap-4 items-center justify-center h-screen">
            <button style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px' }} onClick={() => success('Done', 'Saved successfully')}>Success</button>
            <button style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', borderRadius: '5px' }} onClick={() => error('Oops', 'Something went wrong')}>Error</button>
            <button style={{ backgroundColor: 'yellow', color: 'white', padding: '10px 20px', borderRadius: '5px' }} onClick={() => warning('Warning', 'Something went wrong')}>Warning</button>
            <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px' }} onClick={() => info('Info', 'Something went wrong')}>Info</button>
        </div>
    )
}

export default ToastPage
