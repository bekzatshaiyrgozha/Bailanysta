import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../models/Post';
import { PostService } from '../../service/post.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { GeminiService } from '../../service/gemini.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  selectedFile!: File;
  isPostCreated = false;
  createdPost!: Post;
  previewImgURL: any;
  
  prompt: string = '';
  generatedText: string = '';
  isGenerating: boolean = false;

  constructor(
    private postService: PostService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      body: ['', Validators.required],
    });
  }

  submit(): void {
    this.postService.createPost(this.postForm.value.body, this.selectedFile).subscribe(data => {
      this.createdPost = data;
      console.log(data);
      this.isPostCreated = true;
      this.notificationService.showSnackBar('Post created successfully');
      this.router.navigate(['/profile']);
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e) => {
      this.previewImgURL = reader.result;
    };
  }

  generateWithAI(): void {
    if (!this.prompt.trim()) return;

    this.isGenerating = true;
    console.log(this.prompt);
    

    this.geminiService.generatePost(this.prompt).subscribe({
      next: (res) => {
        this.generatedText = res.generated_text;
        this.postForm.patchValue({ body: this.generatedText });
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('AI Error:', err);
        this.isGenerating = false;
      }
    });
  }
}
