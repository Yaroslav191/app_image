import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { getPin, pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { useEffect, useState } from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';

function PinDetail({ user }) {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, seTcomment] = useState('');
  const [addingComment, setAdingComment] = useState(false);
  const [comments, setComments] = useState(null);

  const { pinId } = useParams();

  const userWithRole = JSON.parse(localStorage.getItem('user'));

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const deleteComment = (item) => {
    client
      .patch(pinId)
      .unset([`comments[_key=="${item._key}"]`])
      .commit()
      .then((data) => {
        fetchPinDetails();
      });
  };

  const addComment = () => {
    if (comment) {
      setAdingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then((data) => {
          console.log(data);
          fetchPinDetails();
          seTcomment('');
          setAdingComment(false);
        })
        .catch((error) => console.log(error));
    }
  };

  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
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
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center
                         text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target="blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg">
            <img
              src={pinDetail.postedBy?.image}
              alt="user-profile"
              className="w-8 h-8 rounder-full object-cover"
            />
            <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((item) => {
              return (
                <div className="flex gap-2 mt-5 items-center bg-5 rounded-lg" key={item._key}>
                  <img
                    src={item.postedBy.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between w-full items-center">
                    <div>
                      <p className="font-bold">{item.postedBy.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                    <div>
                      {(item?.postedBy?._id === user?._id || userWithRole?.role === 'admin') && (
                        <button
                          type="button"
                          className="bg-white p-2 opacity-70 hover:opacity-100
                                 font-bold text-dark  text-base rounded-3xl hover:shadow-md outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComment(item);
                          }}>
                          <AiTwotoneDelete />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2  items-center bg-white rounded-lg">
              <img
                src={pinDetail.postedBy?.image}
                alt="user-profile"
                className="w-8 h-8 rounder-full object-cover"
              />
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none
                    border-2 p-2 rounded-2xl focus:border-gray-300"
              placeholder="Add a comment"
              value={comment}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addComment();
                }
              }}
              onChange={(e) => {
                seTcomment(e.target.value);
              }}
            />
            <button
              type="button"
              className="bg-red-500  text-white
                    rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}>
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      <button onClick={fetchPinDetails}>FETCH</button>

      {pins?.length > 0 && (
        <>
          <h2 className="text-center font-bold txt-2x mt-8 mb-4">More like this</h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
}

export default PinDetail;
