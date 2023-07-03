import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQeury } from '../utils/data';

function Feed() {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);

    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        if (categoryId) {
            const query = searchQeury(categoryId);

            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            });
        } else {
            client.fetch(feedQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
        }
    }, [categoryId]);

    console.log(pins);

    if (loading) return <Spinner message="We are addig new ideas to your feed!" />;

    return <div>{pins && <MasonryLayout pins={pins} />}</div>;
}

export default Feed;
