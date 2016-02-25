import axios from 'axios';
import generateUrls from './generateUrls';

const getConfig = {
  headers: {
    Accept: 'application/vnd.github.v3.star+json',
  },
};


/**
 * get star history
 * @param {sting} repo
 * @return {array} history - {[date: ,starNum: ],...}
 */
export default async function(repo) {
  const {
    samplePageUrls, pageIndexes
  } = await generateUrls(repo).catch(e => {
    console.log(e); // throw don't work
  });
  if (pageIndexes.length < 1) {
    alert('There is no such repo on github or the repo has less then 30 stars')
  }
  const getArray = samplePageUrls.map(url => axios.get(url, getConfig));
  // console.log(getArray);

  const resArray = await Promise.all(getArray).catch(e => {
    console.log(e); // throw don't work
    alert(`Sorry, Git API rate limit exceeded for your ip address, please wait for an hour`);
  });
  // console.log(resArray);

  const starHistory = pageIndexes.map((p, i) => {
    return {
      date: resArray[i].data[0].starred_at.slice(0, 10),
      starNum: 30 * (p - 1),
    };
  });
  console.log(starHistory);

  return starHistory;
}