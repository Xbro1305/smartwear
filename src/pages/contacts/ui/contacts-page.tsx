export const ContactPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}>Контакты</h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Добро пожаловать на страницу <strong>Контакты</strong>! Здесь вы сможете узнать, как связаться с нашей командой для получения дополнительной информации или для решения ваших вопросов.
      </p>

      <h2 style={{ color: '#34495e' }}>Как с нами связаться?</h2>
      <p>
        Вы можете использовать один из следующих способов для связи с нами:
      </p>
      <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
        <li><strong>Электронная почта:</strong> support@example.com</li>
        <li><strong>Телефон:</strong> +7 (123) 456-78-90</li>
        <li><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123</li>
      </ul>

      <h2 style={{ color: '#34495e' }}>Наши социальные сети</h2>
      <p>
        Вы также можете следить за нами в социальных сетях и задавать вопросы через:
      </p>
      <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
        <li><strong>Facebook:</strong> <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">facebook.com/yourpage</a></li>
        <li><strong>Instagram:</strong> <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer">instagram.com/yourpage</a></li>
        <li><strong>Twitter:</strong> <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer">twitter.com/yourpage</a></li>
      </ul>

      <h2 style={{ color: '#34495e' }}>Как мы можем помочь?</h2>
      <p>
        Если у вас возникли вопросы или предложения, наша команда всегда готова помочь. Пожалуйста, не стесняйтесь обратиться к нам любым удобным способом.
      </p>

      <footer style={{ marginTop: '40px', fontSize: '14px', color: '#7f8c8d' }}>
        <p>
          Мы ценим ваше время и всегда стараемся ответить как можно быстрее!
        </p>
      </footer>
    </div>
  );
};