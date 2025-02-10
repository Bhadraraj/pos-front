import { useNavigate } from 'react-router-dom';

const useBackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return goBack;
};

export default useBackButton;
