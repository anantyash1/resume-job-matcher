# from fastapi.security import OAuth2PasswordBearer
# from fastapi import Depends


# from datetime import timedelta
# from datetime import datetime

# from typing import List
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from ..database import get_db
# from ..models import Company, Application, Job, Resume, User
# from ..schemas import (
#     CompanyCreate, CompanyLogin, Company as CompanySchema,
#     ApplicationDetailResponse, Token
# )
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# from ..auth import (
#     verify_password, 
#     get_password_hash, 
#     create_access_token,
#     get_current_user
# )
# from ..config import get_settings
# import json

# router = APIRouter(prefix="/hr", tags=["hr"])
# settings = get_settings()

# @router.post("/register", response_model=CompanySchema)
# def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
#     """Register a new HR/Company account"""
    
#     # Check if company already exists
#     db_company = db.query(Company).filter(
#         (Company.email == company.email) | (Company.name == company.name)
#     ).first()
    
#     if db_company:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Company email or name already registered"
#         )
    
#     # Create new company
#     hashed_password = get_password_hash(company.password)
#     new_company = Company(
#         name=company.name,
#         email=company.email,
#         hashed_password=hashed_password,
#         description=company.description,
#         website=company.website
#     )
    
#     db.add(new_company)
#     db.commit()
#     db.refresh(new_company)
    
#     return new_company

# @router.post("/login", response_model=Token)
# def login_company(company: CompanyLogin, db: Session = Depends(get_db)):
#     """HR/Company login"""
    
#     db_company = db.query(Company).filter(Company.email == company.email).first()
    
#     if not db_company or not verify_password(company.password, db_company.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     # Create access token
#     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": db_company.email, "type": "company"},
#         expires_delta=access_token_expires
#     )
    
#     return {"access_token": access_token, "token_type": "bearer"}

# def get_current_company(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     """Get current company from token"""
#     from ..auth import jwt, JWTError
    
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         email: str = payload.get("sub")
#         user_type: str = payload.get("type")
#         if email is None or user_type != "company":
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
    
#     company = db.query(Company).filter(Company.email == email).first()
#     if company is None:
#         raise credentials_exception
#     return company

# @router.get("/applications", response_model=List[ApplicationDetailResponse])
# def get_company_applications(
#     status_filter: str = None,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     """Get all applications for the company's jobs"""
    
#     query = db.query(Application).filter(
#         Application.company_id == current_company.id
#     )
    
#     if status_filter:
#         query = query.filter(Application.status == status_filter)
    
#     applications = query.order_by(Application.applied_at.desc()).all()
    
#     # Format response
#     results = []
#     for app in applications:
#         user = db.query(User).filter(User.id == app.user_id).first()
#         resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
#         job = db.query(Job).filter(Job.id == app.job_id).first()
        
#         results.append({
#             "id": app.id,
#             "user_id": app.user_id,
#             "user_name": user.username if user else "Unknown",
#             "user_email": user.email if user else "Unknown",
#             "resume_id": app.resume_id,
#             "resume_filename": resume.filename if resume else "Unknown",
#             "job_id": app.job_id,
#             "job_title": job.title if job else "Unknown",
#             "status": app.status,
#             "cover_letter": app.cover_letter,
#             "applied_at": app.applied_at,
#             "skills": json.loads(resume.skills) if resume and resume.skills else []
#         })
    
#     return results

# @router.patch("/applications/{application_id}/status")
# def update_application_status(
#     application_id: int,
#     new_status: str,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     """Update application status"""
    
#     if new_status not in ["pending", "reviewed", "shortlisted", "rejected"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid status"
#         )
    
#     application = db.query(Application).filter(
#         Application.id == application_id,
#         Application.company_id == current_company.id
#     ).first()
    
#     if not application:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Application not found"
#         )
    
#     application.status = new_status
#     application.reviewed_at = datetime.utcnow()
    
#     db.commit()
    
#     return {"message": "Status updated successfully", "new_status": new_status}

# @router.get("/me", response_model=CompanySchema)
# def get_current_company_info(current_company: Company = Depends(get_current_company)):
#     """Get current company information"""
#     return current_company

# # Import oauth2_scheme
# from ..auth import oauth2_scheme



# from datetime import timedelta, datetime
# from typing import List
# import json

# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.orm import Session
# from jose import JWTError, jwt

# from ..database import get_db
# from ..models import Company, Application, Job, Resume, User
# from ..schemas import (
#     CompanyCreate,
#     CompanyLogin,
#     Company as CompanySchema,
#     ApplicationDetailResponse,
#     Token
# )
# from ..auth import (
#     verify_password,
#     get_password_hash,
#     create_access_token
# )
# from ..config import get_settings

# router = APIRouter(prefix="/hr", tags=["hr"])
# settings = get_settings()

# # ✅ DEFINE oauth2_scheme ONLY ONCE
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/hr/login")

# # -----------------------------
# # HR REGISTER
# # -----------------------------
# @router.post("/register", response_model=CompanySchema)
# def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
#     db_company = db.query(Company).filter(
#         (Company.email == company.email) |
#         (Company.name == company.name)
#     ).first()

#     if db_company:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Company email or name already registered"
#         )

#     new_company = Company(
#         name=company.name,
#         email=company.email,
#         hashed_password=get_password_hash(company.password),
#         description=company.description,
#         website=company.website
#     )

#     db.add(new_company)
#     db.commit()
#     db.refresh(new_company)

#     return new_company


# # -----------------------------
# # HR LOGIN
# # -----------------------------
# @router.post("/login", response_model=Token)
# def login_company(company: CompanyLogin, db: Session = Depends(get_db)):
#     db_company = db.query(Company).filter(
#         Company.email == company.email
#     ).first()

#     if not db_company or not verify_password(
#         company.password, db_company.hashed_password
#     ):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

#     access_token = create_access_token(
#         data={"sub": db_company.email, "type": "company"},
#         expires_delta=timedelta(
#             minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
#         )
#     )

#     return {"access_token": access_token, "token_type": "bearer"}


# # -----------------------------
# # GET CURRENT COMPANY
# # -----------------------------
# def get_current_company(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(
#             token,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM]
#         )
#         email: str = payload.get("sub")
#         user_type: str = payload.get("type")

#         if email is None or user_type != "company":
#             raise credentials_exception

#     except JWTError:
#         raise credentials_exception

#     company = db.query(Company).filter(
#         Company.email == email
#     ).first()

#     if company is None:
#         raise credentials_exception

#     return company


# # -----------------------------
# # VIEW APPLICATIONS
# # -----------------------------
# @router.get("/applications", response_model=List[ApplicationDetailResponse])
# def get_company_applications(
#     status_filter: str | None = None,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     query = db.query(Application).filter(
#         Application.company_id == current_company.id
#     )

#     if status_filter:
#         query = query.filter(Application.status == status_filter)

#     applications = query.order_by(
#         Application.applied_at.desc()
#     ).all()

#     results = []
#     for app in applications:
#         user = db.query(User).get(app.user_id)
#         resume = db.query(Resume).get(app.resume_id)
#         job = db.query(Job).get(app.job_id)

#         results.append({
#             "id": app.id,
#             "user_id": app.user_id,
#             "user_name": user.username if user else "Unknown",
#             "user_email": user.email if user else "Unknown",
#             "resume_id": app.resume_id,
#             "resume_filename": resume.filename if resume else "Unknown",
#             "job_id": app.job_id,
#             "job_title": job.title if job else "Unknown",
#             "status": app.status,
#             "cover_letter": app.cover_letter,
#             "applied_at": app.applied_at,
#             "skills": json.loads(resume.skills) if resume and resume.skills else []
#         })

#     return results


# # -----------------------------
# # UPDATE APPLICATION STATUS
# # -----------------------------
# @router.patch("/applications/{application_id}/status")
# def update_application_status(
#     application_id: int,
#     new_status: str,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     if new_status not in ["pending", "reviewed", "shortlisted", "rejected"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid status"
#         )

#     application = db.query(Application).filter(
#         Application.id == application_id,
#         Application.company_id == current_company.id
#     ).first()

#     if not application:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Application not found"
#         )

#     application.status = new_status
#     application.reviewed_at = datetime.utcnow()

#     db.commit()

#     return {
#         "message": "Status updated successfully",
#         "new_status": new_status
#     }


# # -----------------------------
# # HR PROFILE
# # -----------------------------
# @router.get("/me", response_model=CompanySchema)
# def get_current_company_info(
#     current_company: Company = Depends(get_current_company)
# ):
#     return current_company


from datetime import timedelta, datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Company, Application, Job, Resume, User, JobMatch
from ..schemas import (
    CompanyCreate, CompanyLogin, Company as CompanySchema,
    ApplicationDetailResponse, Token
)
from ..auth import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    oauth2_scheme  # Import this
)
from ..config import get_settings
from jose import JWTError, jwt
import json

router = APIRouter(prefix="/hr", tags=["hr"])
settings = get_settings()

@router.post("/register", response_model=CompanySchema)
def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Register a new HR/Company account"""
    
    # Check if company already exists
    db_company = db.query(Company).filter(
        (Company.email == company.email) | (Company.name == company.name)
    ).first()
    
    if db_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company email or name already registered"
        )
    
    # Create new company
    hashed_password = get_password_hash(company.password)
    new_company = Company(
        name=company.name,
        email=company.email,
        hashed_password=hashed_password,
        description=company.description,
        website=company.website
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return new_company

@router.post("/login", response_model=Token)
def login_company(company: CompanyLogin, db: Session = Depends(get_db)):
    """HR/Company login"""
    
    db_company = db.query(Company).filter(Company.email == company.email).first()
    
    if not db_company or not verify_password(company.password, db_company.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_company.email, "type": "company"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_company(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get current company from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("type")
        if email is None or user_type != "company":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    company = db.query(Company).filter(Company.email == email).first()
    if company is None:
        raise credentials_exception
    return company

#working


# @router.get("/applications", response_model=List[ApplicationDetailResponse])
# def get_company_applications(
#     status_filter: str = None,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     """Get all applications for the company's jobs"""
    
#     query = db.query(Application).filter(
#         Application.company_id == current_company.id
#     )
    
#     if status_filter:
#         query = query.filter(Application.status == status_filter)
    
#     applications = query.order_by(Application.applied_at.desc()).all()
    
#     # Format response
#     results = []
#     for app in applications:
#         user = db.query(User).filter(User.id == app.user_id).first()
#         resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
#         job = db.query(Job).filter(Job.id == app.job_id).first()
        
#         results.append({
#             "id": app.id,
#             "user_id": app.user_id,
#             "user_name": user.username if user else "Unknown",
#             "user_email": user.email if user else "Unknown",
#             "resume_id": app.resume_id,
#             "resume_filename": resume.filename if resume else "Unknown",
#             "job_id": app.job_id,
#             "job_title": job.title if job else "Unknown",
#             "status": app.status,
#             "cover_letter": app.cover_letter,
#             "applied_at": app.applied_at,
#             "skills": json.loads(resume.skills) if resume and resume.skills else []
#         })
    
#     return results


# @router.get("/applications", response_model=List[ApplicationDetailResponse])
# def get_company_applications(
#     status_filter: str = None,
#     current_company: Company = Depends(get_current_company),
#     db: Session = Depends(get_db)
# ):
#     """Get all applications for the company's jobs"""
    
#     query = db.query(Application).filter(
#         Application.company_id == current_company.id
#     )
    
#     if status_filter:
#         query = query.filter(Application.status == status_filter)
    
#     applications = query.order_by(Application.applied_at.desc()).all()
    
#     # Format response
#     results = []
#     for app in applications:
#         user = db.query(User).filter(User.id == app.user_id).first()
#         resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
#         job = db.query(Job).filter(Job.id == app.job_id).first()
        
#         # Calculate match score if available
#         match_score = None
#         job_match = db.query(JobMatch).filter(
#             JobMatch.resume_id == app.resume_id,
#             JobMatch.job_id == app.job_id
#         ).first()
        
#         if job_match:
#             match_score = job_match.similarity_score
        
#         results.append({
#             "id": app.id,
#             "user_id": app.user_id,
#             "user_name": user.username if user else "Unknown",
#             "user_email": user.email if user else "Unknown",
#             "resume_id": app.resume_id,
#             "resume_filename": resume.filename if resume else "Unknown",
#             "job_id": app.job_id,
#             "job_title": job.title if job else "Unknown",
#             "status": app.status,
#             "cover_letter": app.cover_letter,
#             "applied_at": app.applied_at,
#             "skills": json.loads(resume.skills) if resume and resume.skills else [],
#             "similarity_score": match_score
#         })
    
#     return results


@router.get("/applications", response_model=List[ApplicationDetailResponse])
def get_company_applications(
    status_filter: str = None,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """Get all applications for the company's jobs"""
    
    try:
        query = db.query(Application).filter(
            Application.company_id == current_company.id
        )
        
        if status_filter:
            query = query.filter(Application.status == status_filter)
        
        applications = query.order_by(Application.applied_at.desc()).all()
        
        # Format response
        results = []
        for app in applications:
            try:
                user = db.query(User).filter(User.id == app.user_id).first()
                resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
                job = db.query(Job).filter(Job.id == app.job_id).first()
                
                # Calculate match score if available
                from ..models import JobMatch
                match_score = None
                job_match = db.query(JobMatch).filter(
                    JobMatch.resume_id == app.resume_id,
                    JobMatch.job_id == app.job_id
                ).first()
                
                if job_match:
                    match_score = job_match.similarity_score
                
                results.append({
                    "id": app.id,
                    "user_id": app.user_id,
                    "user_name": user.username if user else "Unknown",
                    "user_email": user.email if user else "Unknown",
                    "resume_id": app.resume_id,
                    "resume_filename": resume.filename if resume else "Unknown",
                    "job_id": app.job_id,
                    "job_title": job.title if job else "Unknown",
                    "status": app.status,
                    "cover_letter": app.cover_letter,
                    "applied_at": app.applied_at,
                    "skills": json.loads(resume.skills) if resume and resume.skills else [],
                    "similarity_score": match_score
                })
            except Exception as e:
                print(f"Error processing application {app.id}: {str(e)}")
                continue
        
        return results
        
    except Exception as e:
        print(f"Error in get_company_applications: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching applications: {str(e)}"
        )


@router.patch("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    new_status: str,
    current_company: Company = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """Update application status"""
    
    if new_status not in ["pending", "reviewed", "shortlisted", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.company_id == current_company.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    application.status = new_status
    application.reviewed_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Status updated successfully", "new_status": new_status}

@router.get("/me", response_model=CompanySchema)
def get_current_company_info(current_company: Company = Depends(get_current_company)):
    """Get current company information"""
    return current_company