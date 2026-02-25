import React from 'react';
import { useQueue } from '../hooks/ApiHooks';

type FailedJob = {
  id: string;
  name: string;
  data: {
    projectId?: string;
    location?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  failedReason: string;
  attemptsMade: number;
  stacktrace: string[];
};

const QueueTable: React.FC = () => {
  const { queueInfo, loading, error, getQueueInfo } = useQueue();
  React.useEffect(() => {
    getQueueInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    console.log(queueInfo);
  }, [queueInfo]);
  if (loading) {
    return <div>Loading queue information...</div>;
  }
  if (error) {
    return <div>Error loading queue information: {error}</div>;
  }

  return (
    <div>
      <h2>Automation Queue</h2>
      {queueInfo ? (
        <div>
          <p>Active: {queueInfo.automationQueue.counts.active}</p>
          <p>Completed: {queueInfo.automationQueue.counts.completed}</p>
          <p>Failed: {queueInfo.automationQueue.counts.failed}</p>
          <p>Waiting: {queueInfo.automationQueue.counts.waiting}</p>
          <h3>Failed Jobs</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Failed Reason</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {queueInfo.automationQueue.failed.map((job: FailedJob) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.name}</td>
                  <td>{job.stacktrace}</td>
                  <td>
                    <pre>{JSON.stringify(job.data, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No queue information available.</p>
      )}
      <h2>Enrichment Queue</h2>
      {queueInfo ? (
        <div>
          <p>Active: {queueInfo.enrichmentQueue.counts.active}</p>
          <p>Completed: {queueInfo.enrichmentQueue.counts.completed}</p>
          <p>Failed: {queueInfo.enrichmentQueue.counts.failed}</p>
          <p>Waiting: {queueInfo.enrichmentQueue.counts.waiting}</p>
          <h3>Failed Jobs</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Failed Reason</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {queueInfo.enrichmentQueue.failed.map((job: FailedJob) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.name}</td>
                  <td>{job.stacktrace}</td>
                  <td>
                    <pre>{JSON.stringify(job.data, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No queue information available.</p>
      )}
    </div>
  );
};

export default QueueTable;
