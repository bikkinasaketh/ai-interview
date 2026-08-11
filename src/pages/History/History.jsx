import "./History.css";

function History() {

  const history = [
    {
      id:1,
      category:"Frontend",
      topic:"React",
      score:"92%",
      date:"05 Aug 2026"
    },
    {
      id:2,
      category:"Backend",
      topic:"Java",
      score:"88%",
      date:"04 Aug 2026"
    },
    {
      id:3,
      category:"HR",
      topic:"Self Introduction",
      score:"95%",
      date:"03 Aug 2026"
    },
    {
      id:4,
      category:"Python",
      topic:"OOP",
      score:"90%",
      date:"02 Aug 2026"
    }
  ];

  return (
    <section className="history-page">

      <div className="history-container">

        <h1>Interview History</h1>

        <table>

          <thead>

            <tr>

              <th>Date</th>
              <th>Category</th>
              <th>Topic</th>
              <th>Score</th>

            </tr>

          </thead>

          <tbody>

            {history.map((item)=>(

              <tr key={item.id}>

                <td>{item.date}</td>

                <td>{item.category}</td>

                <td>{item.topic}</td>

                <td>{item.score}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );

}

export default History;