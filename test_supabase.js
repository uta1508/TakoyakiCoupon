const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing news...");
  const { data: newsData, error: newsError } = await supabase.from("news").select("*");
  console.log("News Data:", newsData ? newsData.length : null);
  console.log("News Error:", newsError);
  
  console.log("\nTesting gallery...");
  const { data: galleryData, error: galleryError } = await supabase.storage.from("gallery").list();
  console.log("Gallery Data:", galleryData ? galleryData.length : null);
  console.log("Gallery Error:", galleryError);
}

test();
