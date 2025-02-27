import FormData from './components/Form'
import RecordList from './components/RecordList'
import HeaderSchool from './components/Header'
import { useState } from 'react'


function App() {
  const [reload, setReload] = useState(false);

  const refreshRecords = () => {
    setReload(!reload);
  };

  return (
    <>
      <HeaderSchool />
      <FormData onAddRecord={refreshRecords}  />
      <RecordList key={reload} />
    </>
  )

}


export default App
