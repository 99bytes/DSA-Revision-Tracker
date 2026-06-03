import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:AyushSinha5619@db.ysoxztitpokxlrifkemi.supabase.co:5432/postgres',
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully!');
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

run();
