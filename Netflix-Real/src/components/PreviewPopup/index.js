import React, { createRef, useCallback, useEffect, useState } from 'react';
import './PreviewPopup.scss';
import PreviewPlayer from '../PreviewPlayer';
import PreviewInfo from '../PreviewInfo';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showPopUpInfo } from '../../services/redux/actions';

// const PreviewPopup = (props) => {
//     const params = new URLSearchParams(props.location.search)
//     let tops = props.location.state;
//     const history = useHistory()
//     const dispatch = useDispatch()
//     const showed = useSelector((state) => state.isPopUp)
//     const [open, setOpen] = useState(showed);
//     const popUpRef=createRef(null)

//     const handleOncloseButtonClick = () => {
//         //props.onCloseButton.history.push(props.onCloseButton.location.pathname)
//         setOpen(!open)
//         dispatch(showPopUpInfo(!showed))
//         history.goBack()
//     }
  

//     return (params.get('jbv') &&
//         <dia ref={popUpRef}  className="pop-up__container">
//             <div  className={`pop-up__dialog ${showed ?'pop-up' : 'pop-out'}`}>
//                 <div className="background max-width">
//                     <PreviewPlayer onCloseButton={handleOncloseButtonClick} />
//                     <PreviewInfo />

//                 </div>
//             </div>
//             <div  className="pop-up__background" onClick={handleOncloseButtonClick} >

//             </div>
//         </dia>
//     );
// };

const PreviewPopup = (props) => {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <div className="pop-up__container pt-5">
            <div>
                <div className="background max-width">
                    <PreviewPlayer/>
                    <PreviewInfo />
                </div>
            </div>
        </div>
    );
};

export default PreviewPopup;