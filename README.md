# Better CV

This is a project to create and manage CVs for your job applications.

## Features

### Personal Information

Add your personal information like name, address, phone number, email, etc.

### Work Experience

Add your work experience, including the company name, job title, start
and end dates, and a description of your responsibilities.

For each work experience an embedding is generated using the
`text-embedding-3-small` model. This is used to find relevant work experience
for a specific job application.

### Job Applications

Add job applications, including the company name, job title, application
date, and a description of the job.
Generate a customized CV based on your personal details and work
experience for the specific job description. This is done by finding the
most relevant work experience for the job description using the embeddings.

### Import Details from PDF

Import your personal details and work experience from a PDF file.
This is made possible by passing the PDF text content to the openAI
`gpt-4o-mini` model to get structured data.

## Technologies

- Next.js
- Tailwind CSS
- PostgreSQL (with pgvector extension)
- Drizzle
- OpenAI API
- TypeScript
- tRPC
