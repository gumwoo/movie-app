// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel;
    const stringifiedParams = JSON.stringify(params); // 별도의 변수로 추출
    axios
      .get(url, {
        params,
        cancelToken: new axios.CancelToken(c => (cancel = c)),
      })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (axios.isCancel(err)) return;
        setError(err);
        setLoading(false);
      });
    return () => cancel();
  }, [url, params]); // 'params' 추가

  return { data, loading, error };
}

export default useFetch;
