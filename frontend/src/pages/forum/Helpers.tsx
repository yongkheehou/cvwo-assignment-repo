import { Dispatch, SetStateAction } from 'react';
import { Thread } from '../../features/forum/ForumModels';
import {
  DATE,
  DECREASING,
  INCREASING,
  LIKES,
  TITLE,
} from '../../utils/Constants';

export const sortThreads = (
  criteria: string,
  direction: string,
  threadInfo: Thread[] | null | undefined,
  setThreadInfo: Dispatch<SetStateAction<Thread[] | null | undefined>>,
) => {
  if (criteria == TITLE) {
    if (direction == INCREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort((a, b) =>
          a.Title.localeCompare(b.Title),
        ),
      );
    } else if (direction == DECREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort((a, b) =>
          b.Title.localeCompare(a.Title),
        ),
      );
    }
  } else if (criteria == DATE) {
    if (direction == INCREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort(
          (a, b) => Date.parse(a.CreatedAt) - Date.parse(b.CreatedAt),
        ),
      );
    } else if (direction == DECREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort(
          (a, b) => Date.parse(b.CreatedAt) - Date.parse(a.CreatedAt),
        ),
      );
    }
  } else if (criteria == LIKES) {
    if (direction == INCREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort((a, b) => a.Likes - b.Likes),
      );
    } else if (direction == DECREASING) {
      setThreadInfo(
        [...(threadInfo as Thread[])].sort((a, b) => b.Likes - a.Likes),
      );
    }
  }
};

export const sortThreadsTwo = (
  criteria: string,
  direction: string,
  threadInfo: Thread[] | null | undefined,
) => {
  if (criteria == TITLE) {
    if (direction == INCREASING) {
      return [...(threadInfo as Thread[])].sort((a, b) =>
        a.Title.localeCompare(b.Title),
      );
    } else if (direction == DECREASING) {
      return [...(threadInfo as Thread[])].sort((a, b) =>
        b.Title.localeCompare(a.Title),
      );
    }
  } else if (criteria == DATE) {
    if (direction == INCREASING) {
      return [...(threadInfo as Thread[])].sort(
        (a, b) => Date.parse(a.CreatedAt) - Date.parse(b.CreatedAt),
      );
    } else if (direction == DECREASING) {
      return [...(threadInfo as Thread[])].sort(
        (a, b) => Date.parse(b.CreatedAt) - Date.parse(a.CreatedAt),
      );
    }
  } else if (criteria == LIKES) {
    if (direction == INCREASING) {
      return [...(threadInfo as Thread[])].sort((a, b) => a.Likes - b.Likes);
    } else if (direction == DECREASING) {
      return [...(threadInfo as Thread[])].sort((a, b) => b.Likes - a.Likes);
    }
  }
};
