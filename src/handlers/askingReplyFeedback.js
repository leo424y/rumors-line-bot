import gql from '../gql';

export default async function askingReplyFeedback(params) {
  let { data, state, event, issuedAt, userId, replies, isSkipUser } = params;

  if (!data.selectedReply) {
    throw new Error('selectedReply not set in data');
  }

  const { data: { action: { feedbackCount } } } = await gql`
    mutation($vote: FeedbackVote!, $id: String!) {
      action: CreateOrUpdateReplyConnectionFeedback(
        vote: $vote
        replyConnectionId: $id
      ) {
        feedbackCount
      }
    }
  `(
    {
      id: data.selectedReply.replyConnectionId,
      vote: event.input === 'y' ? 'UPVOTE' : 'DOWNVOTE',
    },
    { userId }
  );

  replies = [
    {
      type: 'text',
      text: feedbackCount > 1
        ? `感謝您與其他 ${feedbackCount - 1} 人的回饋。`
        : '感謝您的回饋，您是第一個評論這份文章與回應的人 :)',
    },
  ];

  state = '__INIT__';
  return { data, state, event, issuedAt, userId, replies, isSkipUser };
}
