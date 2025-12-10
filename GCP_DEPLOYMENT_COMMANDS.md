# GCP Deployment Commands

## Project Information
- **Project ID:** kinetic-bot-473806-n6
- **Region:** asia-south2
- **Cloud SQL Instance:** mysecondprojectdb
- **Cloud SQL Connection:** kinetic-bot-473806-n6:asia-south2:mysecondprojectdb
- **DB User:** mysecondprojectuser
- **DB Password:** Pari@2004
- **DB Name:** postgres

## Deployed URLs
- **Frontend:** https://frontend-902316902825.asia-south2.run.app
- **Backend:** https://backend-902316902825.asia-south2.run.app

---

## Complete Deployment Commands

### 1. Authenticate Docker with Artifact Registry
```bash
gcloud auth configure-docker asia-south2-docker.pkg.dev
```

### 2. Build Backend Docker Image
```bash
docker build -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest ./backend
```

### 3. Push Backend Image
```bash
docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest
```

### 4. Build Frontend Docker Image (with correct backend URL)
```bash
docker build --no-cache -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest --build-arg VITE_API_BASE_URL=https://backend-902316902825.asia-south2.run.app/api ./frontend
```

### 5. Push Frontend Image
```bash
docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest
```

### 6. Deploy Backend to Cloud Run
```bash
gcloud run deploy backend \
  --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest \
  --region=asia-south2 \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=kinetic-bot-473806-n6:asia-south2:mysecondprojectdb \
  --update-env-vars=DB_SOCKET_PATH=/cloudsql/kinetic-bot-473806-n6:asia-south2:mysecondprojectdb,DB_USER=mysecondprojectuser,DB_PASSWORD=Pari@2004,DB_NAME=postgres,ALLOWED_ORIGINS=https://frontend-902316902825.asia-south2.run.app \
  --max-instances=10 \
  --min-instances=0 \
  --memory=512Mi
```

### 7. Deploy Frontend to Cloud Run
```bash
gcloud run deploy frontend \
  --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest \
  --region=asia-south2 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --max-instances=10 \
  --min-instances=0 \
  --memory=256Mi
```

---

## Useful Commands

### Check Cloud Run Services
```bash
gcloud run services list --region=asia-south2
```

### Check Backend Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=backend" --limit=50 --format=json
```

### Check Frontend Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=frontend" --limit=50 --format=json
```

### Test Backend Health
```bash
curl https://backend-902316902825.asia-south2.run.app/health
```

### Test Backend API
```bash
curl https://backend-902316902825.asia-south2.run.app/api/entries
```

### Create Entry via API
```bash
curl -X POST https://backend-902316902825.asia-south2.run.app/api/entries \
  -H "Content-Type: application/json" \
  -d '{"content":"Test entry from command line"}'
```

### List Cloud SQL Instances
```bash
gcloud sql instances list
```

### Get Cloud SQL Connection Name
```bash
gcloud sql instances describe mysecondprojectdb --format="value(connectionName)"
```

### List Cloud SQL Users
```bash
gcloud sql users list --instance=mysecondprojectdb
```

### Delete Cloud Run Service
```bash
# Delete backend
gcloud run services delete backend --region=asia-south2

# Delete frontend
gcloud run services delete frontend --region=asia-south2
```

### Update Backend Environment Variables
```bash
gcloud run services update backend \
  --region=asia-south2 \
  --update-env-vars=DB_SOCKET_PATH=/cloudsql/kinetic-bot-473806-n6:asia-south2:mysecondprojectdb,DB_USER=mysecondprojectuser,DB_PASSWORD=Pari@2004,DB_NAME=postgres,ALLOWED_ORIGINS=https://frontend-902316902825.asia-south2.run.app \
  --add-cloudsql-instances=kinetic-bot-473806-n6:asia-south2:mysecondprojectdb
```

---

## Redeploy Everything (Quick Reference)

### Full Redeploy
```bash
# Build and push backend
docker build -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest ./backend
docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest

# Build and push frontend
docker build --no-cache -t asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest --build-arg VITE_API_BASE_URL=https://backend-902316902825.asia-south2.run.app/api ./frontend
docker push asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest

# Deploy backend
gcloud run deploy backend \
  --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/backend:latest \
  --region=asia-south2 \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=kinetic-bot-473806-n6:asia-south2:mysecondprojectdb \
  --update-env-vars=DB_SOCKET_PATH=/cloudsql/kinetic-bot-473806-n6:asia-south2:mysecondprojectdb,DB_USER=mysecondprojectuser,DB_PASSWORD=Pari@2004,DB_NAME=postgres,ALLOWED_ORIGINS=https://frontend-902316902825.asia-south2.run.app \
  --max-instances=10 \
  --min-instances=0 \
  --memory=512Mi

# Deploy frontend
gcloud run deploy frontend \
  --image=asia-south2-docker.pkg.dev/kinetic-bot-473806-n6/myfirstproject-repo/frontend:latest \
  --region=asia-south2 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --max-instances=10 \
  --min-instances=0 \
  --memory=256Mi
```

---

## Environment Variables

### Backend Environment Variables
- `DB_SOCKET_PATH`: /cloudsql/kinetic-bot-473806-n6:asia-south2:mysecondprojectdb
- `DB_USER`: mysecondprojectuser
- `DB_PASSWORD`: Pari@2004
- `DB_NAME`: postgres
- `ALLOWED_ORIGINS`: https://frontend-902316902825.asia-south2.run.app
- `PORT`: 8080 (automatically set by Cloud Run)

### Frontend Build Arguments
- `VITE_API_BASE_URL`: https://backend-902316902825.asia-south2.run.app/api
