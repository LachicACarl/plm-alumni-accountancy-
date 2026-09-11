insert into public.batches (year, description, highlights)
values
  (2026, 'Bachelor of Science in Accountancy graduating batch.', array['CPA Board Exam Preparation', 'Alumni Networking', 'Career Development']),
  (2025, 'Bachelor of Science in Accountancy graduating batch.', array['CPALE Passers', 'Alumni Homecoming', 'Career Development']),
  (2024, 'Bachelor of Science in Accountancy graduating batch.', array['Professional Development', 'Alumni Networking', 'Community Engagement']),
  (2023, 'Bachelor of Science in Accountancy graduating batch.', array['Professional Development', 'Career Growth', 'Alumni Networking']),
  (2022, 'Bachelor of Science in Accountancy graduating batch.', array['Career Development', 'Professional Networking', 'Community Engagement']),
  (2021, 'Bachelor of Science in Accountancy graduating batch.', array['Professional Development', 'Career Growth', 'Alumni Networking']),
  (2020, 'Bachelor of Science in Accountancy graduating batch.', array['Career Development', 'Professional Networking', 'Community Engagement']),
  (2019, 'Bachelor of Science in Accountancy graduating batch.', array['Professional Development', 'Career Growth', 'Alumni Networking'])
on conflict (year) do nothing;
