// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel;
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
  }, [url, params]); // 'params'를 의존성 배열에 포함

  return { data, loading, error };
}

export default useFetch;
