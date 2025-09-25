const RootPage = () => {
  
  let myName:Record<string,(string|number)[]> 
    myName = {key:[23]}

  const test = () => {
    alert('test')
  }
  const testValue = ' default '
  return (
    <div>
      <form onSubmit={test}>
        <label htmlFor='radioInput' className='w-56 h-[100px] bg-red-500'>
          تست
        </label>
        <input
          placeholder='اینجا تایپ کنید'
          id='radioInput'
          // type='file'
          // src='/file.svg'
          // onChange={(event) => alert(event.target.value)}
          style={{ border: '1px solid gray' }}
        />
        <input
          // value={'submit'}
          // onChange={(event) => alert(event.target.value)}
          style={{ border: '1px solid gray' }}
        />
        {/* <button>submit</button> */}
      </form>
    </div>
  )
}

export default RootPage
