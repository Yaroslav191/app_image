import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { useEffect, useState } from 'react';

function PinDetail({ user }) {
    const [pins, setPins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [comment, seTcomment] = useState('');
    const [addingComment, setaAdingComment] = useState(false);

    const { pinId } = useParams();

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);

        if (query) {
            client.fetch(query).then((data) => {
                setPinDetail(data[0]);

                if (data[0]) {
                    query = pinDetailMorePinQuery(data[0]);

                    client.fetch(query).then((res) => setPins(res));
                }
            });
        }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);
    if (!pinDetail) return <Spinner message="Loading pin..." />;

    return (
        <div
            className="flex xl-flex-row flex-col m-auto bg-white"
            style={{ maxWidthL: '1500px', borderRadius: '32px' }}>
            <div className="flex justify-center items-center md:flex-start flex-initial">
                <img
                    src={pinDetail?.image && urlFor(pinDetail.image).url()}
                    alt="user-post"
                    className="rounded-t-3xl rounded-b-lg"
                />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <a href={`${pinDetail.image.asset.url}?=dl=`} download></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PinDetail;
