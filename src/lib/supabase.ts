import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://zswspypgbmnzdbeomdfh.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE5OWM4YjhjLTQ3ZDYtNDY0MS1hOTU5LWQxN2RlZDJjYjUwYiJ9.eyJwcm9qZWN0SWQiOiJ6c3dzcHlwZ2JtbnpkYmVvbWRmaCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1NzA2MzMwLCJleHAiOjIwODEwNjYzMzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.1MQZhfFeRBHe5H87qNBLEug9lGinaWFnSnl1A5LYFWI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };