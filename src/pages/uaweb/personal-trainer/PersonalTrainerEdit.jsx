import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { personalTrainerSelector, updatePersonalTrainer } from '../../../features/personalTrainerSlice';
import Dashboard from '../../components/Dashboard'
import InputModel1 from '../../components/InputModel1';
import TextEditor from '../../components/TextEditor';

function PersonalTrainerEdit() {
  const { isError, isSuccess, massage } = useSelector(
    (state) => state.personalTrainers
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clubId, setClubId] = useState('');
  const [file, setFile] = useState('');
  const [preview, setPreview] = useState('');

  const personalTrainer = useSelector((state) => personalTrainerSelector.selectById(state, id));
  
  useEffect(() => {
    if (personalTrainer) {
      setName(personalTrainer.name)
      setDescription(personalTrainer.description)
      setClubId(personalTrainer.clubId)
    } else {
      navigate('/uaweb/personal-trainer');
    }
  },[personalTrainer])

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  }
  
  useEffect(() => {
    if(isSuccess) {
      navigate('/uaweb/personal-trainer');
    }
  }, [navigate, dispatch, isSuccess])

  const updatePt = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("clubId", clubId);
    formData.append("file", file);
    await dispatch(updatePersonalTrainer({id, formData}));
  }

  return (
    <Dashboard>
      <div className="mx-4 mb-3">
        <button onClick={() => navigate(-1)} className="py-0.5 px-4 bg-neutral-300 hover:bg-neutral-400 text-black/70 font-bold rounded-lg">{`<- Back`}</button>
      </div>
      <div className="col-span-full xl:col-span-8 bg-white dark:bg-neutral-900 shadow-lg rounded-md border border-slate-200">
        <header className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-xl">PersonalTrainerEdit</h2>
        </header>
        <div className="pb-3 px-2">
          <form onSubmit={updatePt}>
            <div className="grid md:grid-cols-2">
              <div className="p-2">
                <InputModel1 label="Name" type="text" name="name" id="name" value={name} onChange={(e) => {setName(e.target.value)}}/>
                <div className="pt-4 my-2">
                  <label className="flex items-center space-x-4">
                    <span className="min-w-max">Select Club</span>
                    <select onChange={(e) => {setClubId(e.target.value);}} value={clubId} className="px-2 w-full bg-transparent focus:ring-0 border-0 border-b text-black focus:border-black dark:text-white dark:bg-neutral-900">
                      <option >Select Club</option>
                      <option value="1">HO</option>
                      <option value="2">Merr</option>
                      <option value="3">Marvell</option>
                      <option value="4">Tidar</option>
                      <option value="5">Lenmarc</option>
                    </select>
                  </label>
                </div>
                <div className="pt-4 my-2">
                  <label className="flex items-center space-x-4">
                    <span className="min-w-max">Image</span>
                    <input type="file" name="file" id="file" onChange={loadImage} className="px-2 w-full bg-transparent focus:ring-0 border-0 border-b text-black dark:text-white focus:border-black" />
                  </label>
                </div>
              </div>
              <div className="p-2 max-h-80">
                <h2 className="mb-2">Preview Image :</h2>
                {preview ? (
                    <img src={preview} alt="Preview Image" className="h-full mx-auto" />
                ) : <img src={personalTrainer ? personalTrainer.url : ''} alt="Preview Image" className="h-full mx-auto"/> }
              </div>
            </div>
            <div className="pt-4 my-2">
              <label className="">Description :</label>
              <TextEditor setValue={setDescription} value={description}/>
            </div>
            <div className="my-4">
              <button className="px-4 py-1 bg-green-500 text-white rounded" type="submit">Update</button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  )
}

export default PersonalTrainerEdit