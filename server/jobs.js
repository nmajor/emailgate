import moment from 'moment';
import { sendMail } from './util/mail';
import { getActivitySummaryData } from './mailers/helper';
import ActivitySummary from './mailers/ActivitySummary';

export function test() {
  console.log('Running the test job!');
}

export function activitySummary() {
  getActivitySummaryData()
  .then((props) => {
    const mailer = new ActivitySummary(props);

    const data = {
      from: 'notify@missionarymemoir.com',
      to: 'missionarymemoir@gmail.com',
      subject: `Missionary Memoir - Activity Summary for ${moment(props.yesterday).format('dddd MMM Do, YYYY')}`,
      html: mailer.toString(),
    };

    sendMail(data);
  });
}
